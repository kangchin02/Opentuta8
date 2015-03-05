define([
    'underscore',
    'libs/uuid',
    "libs/url"
], function (uuid) {

    window.setNamespace = function (namespaceString) {
        var parts = namespaceString.split('.'),
            parent = window,
            currentPart = '';

        for (var i = 0, length = parts.length; i < length; i++) {
            currentPart = parts[i];
            parent[currentPart] = parent[currentPart] || {};
            parent = parent[currentPart];
        }
        return parent;
    };

    $$u = setNamespace("com.utils");

//------------------------------------------------
//
//  GENERIC UTILS
//
//------------------------------------------------

    var cmutils = {

        //------------------------------------------------
        //  DEEP CLONE
        // -----------------------------------------------
        deepClone: function (object) {
            var obj = _.isArray(object) == true ? [] : {};
            return $.extend(true, obj, object);
        },


        isEqual: function (o1, o2, cfg, reverse) {
            cfg = cfg || {};
            cfg.exclude = cfg.exclude || {};

            //first we check the reference. we don't care if null== undefined
            if (cfg.strictMode) {
                if (o1 === o2) return true;
            }
            else {
                if (o1 == o2) return true;
            }

            if (typeof o1 == "number" || typeof o1 == "string" || typeof o1 == "boolean" || !o1 ||
                typeof o2 == "number" || typeof o2 == "string" || typeof o2 == "boolean" || !o2) {
                return false;
            }

            if (((o1 instanceof Array) && !(o2 instanceof Array)) ||
                ((o2 instanceof Array) && !(o1 instanceof Array))) return false;

            for (var p in o1) {
                if (cfg.exclude[p] || !o1.hasOwnProperty(p)) continue;
                if (!this.isEqual(o1[p], o2[p], cfg))
                    return false;
            }
            if (!reverse && !cfg.noReverse) {
                reverse = true;
                return this.isEqual(o2, o1, cfg, reverse);
            }
            return true;
        },


        //------------------------------------------------
        //
        //  CALLBACK MANAGER
        //
        // -----------------------------------------------
        callBackManager: {

            callbacks: {},
            multipleCallbackDict: {},
            index: 0,

            setCallback: function (callbackObj, key) {
                this.index++;
                if (stringutils.isNullOrempty(key) == false) {
                    this.multipleCallbackDict[key] = this.index;
                }
                this.callbacks[this.index] = callbackObj;
                return this.index;
            },


            getCallbackWithKey: function (key) {
                var callbackIndex = this.multipleCallbackDict[key];
                if (callbackIndex == null) {
                    return null;
                }
                return this.getCallback(callbackIndex);
            },


            getCallback: function (callbackIndex) {
                var obj = this.callbacks[callbackIndex];
                this.callbacks[callbackIndex] = null;
                delete this.callbacks[callbackIndex];
                return obj;
            },


            setMultipleCallback: function (callbackObj, key) {
                var callbackIndex = this.multipleCallbackDict[key];
                if (callbackIndex == null) {
                    this.index++;
                    callbackIndex = this.index;
                    this.multipleCallbackDict[key] = callbackIndex;
                }

                var exists = true;
                var arr = this.callbacks[callbackIndex];
                if (arr == null) {
                    exists = false;
                    arr = [];
                    this.callbacks[callbackIndex] = arr;
                }
                arr.push(callbackObj);
                return exists;
            },


            getMultipleCallback: function (key) {
                var callbackIndex = this.multipleCallbackDict[key];
                if (callbackIndex == null) {
                    return null;
                }
                return this.getCallback(callbackIndex);
            },


            notifyMultipleCallbacks: function (data, key, functionName) {
                var callbacks = this.getMultipleCallback(key);
                if (callbacks != null) {
                    for (var i = 0; i < callbacks.length; i++) {
                        var fn = null;
                        var cb = callbacks[i];
                        if (cb != null) {
                            if (functionName != null && cb.hasOwnProperty(functionName)) {
                                fn = cb[functionName];
                            } else {
                                fn = cb;
                            }
                            if (_.isFunction(fn)) {
                                fn(data);
                            }
                        }
                    }
                }
            }
        },

        //---------------------------------------------------------
        //
        //  TEMPLATE MANAGER
        //
        //---------------------------------------------------------

        /**
         * Create a TemplateManager class that can be extended. This has some shortcuts
         * for properly handling adding and removing of views, to ensure all bindings
         * are removed.
         */
        templateManager: {

            _templateMappings: {},

            _templateFiles: {},

            compiledTemplates: {},

            callbacksPending: {},

            _setUpTemplateFiles: {},

            /**
             * @setUpTemplatesInFiles Pass in an HTML document containing template markup inside of
             *                        script tags.  This method will pull out all of the script blocks,
             *                        find the "templateId" from the @name attribute on the script block,
             *                        and create a compiled template from it which can be called later using
             *                        the @getNow() method of TemplateManager
             *
             * @param {String} templateHtml An HTML or text file containing one or more templates
             * @param {String} filename The filename to be referenced later on.
             * @param {String=} location Defaults to "templates" if none is pased in.
             */
            setUpTemplatesInFile: function (templateHtml, filename, location) {
                if (this._setUpTemplateFiles[filename] == null) {
                    this._setUpTemplateFiles[filename] = "loaded";
                    var div = '<div id="tmpTemplateHolder"></div>';
                    var body = $(document).find("body");
                    $(body).append(div);

                    div = $("#tmpTemplateHolder");
                    $(div).append(templateHtml);

                    var templateScripts = $(div).find("script[type='text/x-handlebars-template']");
                    for (var i = 0; i < templateScripts.length; i++) {
                        var templateScript = templateScripts[i];
                        var templateId = $(templateScript).attr("name");
                        if (templateId == null) {
                            templateId = $(templateScript).attr("id");
                        }
                        var template = $(templateScript).html();
                        var templ = this.getExistingOrCompileNew(template, templateId, filename, location);

                        var isPartial = $(templateScript).attr("partial");
                        if (isPartial === "true") {
                            Handlebars.registerPartial(templateId, templ);
                        }
                    }

                    $("#tmpTemplateHolder").remove();
                }
            },


            /**
             * @getExistingOrCompileNew Pass in a raw template, give it an ID and a filename, this
             *                          method will compile the template and return the compiled instance. As
             *                          well, this template will be accessible later via the @getNow() method.
             *
             * @param templateHtml The raw template html, no script block should be wrapping the text
             * @param templateId A templateId to use for later reference to the compiled template
             * @param filename The filename from which the template is derived.
             * @param location Defaults to "templates" if no value is passed in.
             *
             * @return Compiled Handlebars Template function
             */
            getExistingOrCompileNew: function (templateHtml, templateId, filename, location) {
                if (location == null) {
                    location = "templates";
                }

                if (filename == null) {
                    filename = this._templateMappings[templateId];

                    if (filename == null) {
                        filename = "";
                    }
                }

                var url = location + "/" + filename;
                var key = url + "_" + templateId;

                if (this.compiledTemplates[key] == null) {
                    var compiled = Handlebars.compile(templateHtml);
                    this.compiledTemplates[key] = compiled;
                }
                return this.compiledTemplates[key];
            },


            /**
             * @getNow Looks up a template by templateId, filename, and location and returns
             *          the compiled template function if it exists.
             *
             * @param templateId
             * @param filename
             * @param location
             * @return Compiled Template Function, or null
             */
            getNow: function (templateId, filename, location) {
                if (location == null) {
                    location = "templates";
                }

                if (filename == null) {
                    filename = this._templateMappings[templateId];

                    if (filename == null) {
                        filename = "";
                    }
                }

                var url = location + "/" + filename;

                var key = url + "_" + templateId;
                var template = this.compiledTemplates[key];

                if (template != null) {
                    return template;
                }

                //check to see if it has already been loaded with page load
                var _tmpId = "#" + templateId;
                var loadedTemplate = $(_tmpId);
                if ($(loadedTemplate)[0] != null) {
                    var compiledTemplate = Handlebars.compile($(loadedTemplate).html());
                    this.compiledTemplates[key] = compiledTemplate;
                    return this.compiledTemplates[key];
                }
            },


            /**
             * Retrieves a javascript template file from the server.  The file should have one or more script
             * blocks annotated with "type=text/x-handlebars-template". This method retrieves the file from the server,
             * parses all template blocks, using the @id attribute as the templateId, and sets the compiled template
             * functions to cache.  The specific template requested will be returned in the callback method.
             *
             * Note that this method will first check to see if the template is already compiled, and if so, returns it,
             * and also checks to see if the template is found on the DOM, in which case it will not call for the file
             * from the server.
             *
             * @param templateId
             * @param filename
             * @param location
             * @param callBack
             * @param context
             */
            get: function (templateId, filename, location, callBack, context) {
                var context = context;

                if (location == null) {
                    location = "templates";
                }

                if (filename == null) {
                    filename = this._templateMappings[templateId];

                    if (filename == null) {
                        filename = "";
                    }
                }

                var url = location + "/" + filename;

                //this allows us to load multiple templates with the same ID, from different
                //files
                var key = url + "_" + templateId;

                //Check to see if we've already loaded this template;
                var template = this.compiledTemplates[key];

                if (template != null) {
                    //check to see if this is a javascript file, if it is, we need to eval here
                    if (filename.indexOf(".js") > 0) {
                        eval(template);
                    }
                    if (callBack != null) {
                        callBack(template, context);
                        return;
                    }
                }

                //check to see if it has already been loaded with page load
                if (filename == "") {
                    var _tmpId = "#" + templateId;
                    var loadedTemplate = $(_tmpId);
                    if ($(loadedTemplate)[0] != null) {
                        var compiledTemplate = Handlebars.compile($(loadedTemplate).html());
                        this.compiledTemplates[templateId] = compiledTemplate;

                        callBack(this.compiledTemplates[key], context);
                        return;
                    }
                    throw "No Template with Id " + templateId + " found on Page, and a proper URL could not be created";
                }

                var file = this._templateFiles[url];

                if (file) {
                    //We have already loaded the file, and the ID wasn't found, so we're screwed'
                    throw "No Template id found in file provided";
                }
                else if (this.callbacksPending[url] != null) {
                    //We have an outstanding call for this particular file already...queue callback
                    var callbacks = this.callbacksPending[url];
                    callbacks.push({callBack: callBack, templateId: templateId, context: context});
                }
                else {
                    //We need to go look for the file and find all templates within that file
                    callbacks = [];
                    callbacks.push({callBack: callBack, templateId: templateId, context: context});
                    this.callbacksPending[url] = callbacks;

                    var self = this;

                    //Grab javascript files here!
                    if (filename.indexOf(".js") > 0) {
                        $.getScript(url, function (data, textStatus, jqxhr) {

                            var templateId = "";
                            var key = url + "_" + templateId;
                            self._templateFiles[url] = "javascript file loaded";

                            self.compiledTemplates[key] = data;

                            var pendingcallbacks = self.callbacksPending[url];
                            if (pendingcallbacks != null) {
                                var i;
                                for (i = 0; i < pendingcallbacks.length; i++) {
                                    var callback = pendingcallbacks[i]["callBack"];
                                    var templateId = pendingcallbacks[i]["templateId"];
                                    var context = pendingcallbacks[i]["context"];
                                    var key = url + "_" + templateId;

                                    callback(self.compiledTemplates[key], context);
                                }
                                self.callbacksPending[url] = null;
                            }
                        });
                    } else {
                        $.get(url, function (data) {

                            self._templateFiles[url] = data;

                            //add any templates or javascript to the cache
                            $(data).select('script').each(function () {
                                var type = $(this).attr("type");
                                if (type != null) {
                                    var templateId = $(this).attr('id');
                                    var key = url + "_" + templateId;

                                    if (type == "text/x-handlebars-template") {

                                        self.compiledTemplates[key] = Handlebars.compile($(this).html());
                                    }
                                    else if (type == "text/javascript") {
                                        self.compiledTemplates[key] = this;
                                    }
                                    else {
                                        self.compiledTemplates[key] = $(this).html();
                                    }
                                }
                            });


                            var pendingcallbacks = self.callbacksPending[url];
                            if (pendingcallbacks != null) {
                                var i;
                                for (i = 0; i < pendingcallbacks.length; i++) {
                                    var callback = pendingcallbacks[i]["callBack"];
                                    var templateId = pendingcallbacks[i]["templateId"];
                                    var context = pendingcallbacks[i]["context"];
                                    var key = url + "_" + templateId;
                                    callback(self.compiledTemplates[key], context);
                                }
                                self.callbacksPending[url] = null;
                            }
                        });
                    }
                }
            }
        }
    }
    $$u.cmutils = window.cmutils = cmutils;

//------------------------------------------------
//
//  VIEW UTILS
//
//------------------------------------------------
    var viewutils = {

        /**
         * Changes the text of a bootstrap tooltip
         * @param $elem     - The tooltipped element
         * @param str       - The new text
         */
        changeTooltipText: function ($elem, str) {

            $elem.attr('title', str);
            $elem.tooltip('hide')
                .attr('data-original-title', str)
                .tooltip('fixTitle')
            ;
        },


        /**
         * Get rid of target="_blank" or "_new" on these links in mobile
         * @param sel - jQuery selector representing parent container where links may be found
         */
        stripTargetAttrFromLinks: function(sel) {
            if (viewutils.isMobileLayout()) {
                var links = $(sel).find("a");
                _.each(links, function(a) {
                    $(a).attr("target", null);
                });
            }
        },


        isMobileLayout: function () {

            if (Modernizr.mq('only all')) {

                // For as much consistency as possible between isMobileLayout() and our actual
                // media queries, try to answer this query the same way, since we're now
                // considering device orientation. Refer to less/variables.less for the definition
                // of media query we'll use for our main mobile breakpoint.
                //

                var mediaQuery = this.getMobileMediaQuery();
                return Modernizr.mq(mediaQuery);

            }
            else {

                // If the browser doesn't support media queries (e.g., old IE versions), it likely
                // is unreliable in its ability to report orientation, and in any case, it's
                // probably irrelevant, so just use the old raw width method, except determine
                // landscape orientation with arithmetic
                //
                var width = window.innerWidth || document.documentElement.clientWidth;
                var height = window.innerHeight || document.documentElement.clientHeight;

                return width < 768 || this.isTabletLayout() && width > height;
            }

        },


        getMobileMediaQuery: _.memoize(function() {
            var media = "only all";
            var smallTabletLayout = "( max-width: 767px )";
            var landscapeTabletLayout = "(min-width: 768px) and (max-width: 979px) and (orientation: landscape)";

            return _.map([smallTabletLayout, landscapeTabletLayout], function(layout) {
                return media + " and " + layout;
            }).join(", ");

        }),

        isTabletLayout: function () {
            var width = window.innerWidth || document.documentElement.clientWidth;
            return width >= 768 && width <= 979;
        }
    };
    $$u.viewutils = window.viewutils = viewutils;


//------------------------------------------------
//
//  String Utils
//
// -----------------------------------------------
    var stringutils = {
        isNullOrempty: function (value) {
            if (value == null || value == "") {
                return true;
            }
            return false;
        },

        stripHtml: function (str) {
            if (str == null) {
                return str;
            }
            var str1 = str.replace(/(<([^>]+)>)/ig, "");
            var str2 = str1.replace(/&nbsp;/g, '');
            return str2;
        },

        capitalizeFirstLetter: function (s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        },

        capitalizeEachWord: function(s) {
            var re = /\s+/;
            var words = s.split(re);
            var capitalizedWords = _.map(words, function(word) {
                return $$u.stringutils.capitalizeFirstLetter(word);
            }, this);

            return capitalizedWords.join(" ");
        },

        splitFullname: function(fullname) {
            if (String.isNullOrEmpty(fullname)) {
                return ["", "", ""];
            }

            fullname = $.trim(fullname);
            var names = fullname.split(" "), first = "", last = "", middle = "";
            first = names[0];

            names.splice(0,1);
            if (names.length > 1) {
                middle = names[0];
                names.splice(0,1);
            }
            last = names.join(" ");

            return [first,middle,last];
        },


        prettyTruncate: function(str, maxLength) {
            return str.length <= maxLength ? str : str.substr(0, maxLength) + '...';
        }
    };

    String.isNullOrEmpty = stringutils.isNullOrempty;
    $$u.stringutils = window.stringutils = stringutils;


    //------------------------------------------------
    //
    //  Color Utils
    //
    // -----------------------------------------------
    var colorutils = {
        /**
         * Test if a string begins with '#'
         * @param color
         */
        isHexColor: function (color) {
            var pattern = new RegExp("^#");
            return pattern.test(color);
        },


        componentToHex: function (c) {
            var hex = parseInt(c).toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        },


        rgbToHex: function (r, g, b) {
            return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
        },


        hexToRgb: function(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },


        shadeColor: function (color, percent) {

            var prefix = "";

            if (this.isHexColor(color)) {
                color = color.slice(1);
                prefix = "#";
            }

            var num = parseInt(color, 16),
                amt = Math.round(2.55 * percent),
                R = (num >> 16) + amt,
                G = (num >> 8 & 0x00FF) + amt,
                B = (num & 0x0000FF) + amt
                ;

            return prefix + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
        },


        generateColorChart: function (pColorMap, $div, inverse, filter) {

            var colorMap;
            var numberOfColors = _.keys(pColorMap).length;

            if (filter) {
                var colorFilter = $$u.colorutils.ColorFilter();
                colorMap = _.mapValues(pColorMap, function(hexColor) {
                    return colorFilter.convert(filter, hexColor);
                })
            }
            else {
                colorMap = $.extend({}, pColorMap);
            }

            var rectWidth = 75;
            var xOffset = 100;
            var yOffset = 100;
            var height = 100;
            var textHeight = 20;

            var backgroundColor = inverse ? '#000' : '#fff';
            var textColor = inverse ? '#fff' : '#000';
            var className = "color-chart" + (inverse ? '-inverse' : '');

            $div.append('<div style="background-color: ' + backgroundColor + ';" class="' + className + '"/>');

            require(['d3'], function (d3) {
                var svg = d3.select('#' + $div[0].id + " ." + className)
                    .append("svg")
                    .attr('width', (numberOfColors + 1) * rectWidth + xOffset)
                    .attr('height', (numberOfColors + 1) * (height + textHeight * 3) + yOffset)
                ;

                _.each(_.keys(colorMap), function (mainColor, mainNdx) {
                    _.each(_.keys(colorMap), function (color, ndx) {
                        var r = svg.append("rect")
                                .attr("x", xOffset + ndx * rectWidth)
                                .attr("y", yOffset + mainNdx * (height + 3 * textHeight))
                                .attr("width", rectWidth + 1)
                                .attr("height", height)
                                .style("fill", colorMap[color])
                            ;

                        svg.append("text")
                            .attr("x", xOffset + ndx * rectWidth)
                            .attr("y", parseInt(r.attr("y")) + height + textHeight)
                            .attr("stroke", textColor)
                            .text(color)
                        ;

                        svg.append("text")
                            .attr("x", xOffset + ndx * rectWidth)
                            .attr("y", parseInt(r.attr("y")) + height + textHeight * 2)
                            .attr("stroke", textColor)
                            .text(colorMap[color])
                        ;
                    });

                    svg.append("rect")
                        .attr("x", xOffset)
                        .attr("y", yOffset + mainNdx * (height + 3 * textHeight) + height / 3)
                        .attr("width", rectWidth * numberOfColors)
                        .attr("height", height / 3)
                        .style("fill", colorMap[mainColor])
                    ;

                    svg.append("text")
                        .attr("x", xOffset - rectWidth)
                        .attr("y", yOffset + mainNdx * (height + 3 * textHeight) + 1.25 * height / 3)
                        .attr("stroke", textColor)
                        .text(mainColor)
                    ;

                    svg.append("text")
                        .attr("x", xOffset - rectWidth)
                        .attr("y", yOffset + mainNdx * (height + 3 * textHeight) + 2 * height / 3)
                        .attr("stroke", textColor)
                        .text(colorMap[mainColor])
                    ;
                });
            });
        },


        // These are taken from variables.less
        //
        themeColorMap: {
            black:                 "#000",
            grayDarker:            "#222",
            grayDark:              "#333",
            gray:                  "#555",
            grayLight:             "#999",
            grayLighter:           "#eee",
            white:                 "#fff",
            blue:                  "#049cdb",
            blueDark:              "#0064cd",
            blueLight:             "#51ccff",
            green:                 "#46a546",
            red:                   "#9d261d",
            yellow:                "#ffc40d",
            orange:                "#f89406",
            pink:                  "#c3325f",
            purple:                "#7a43b6"
        },

        accessibleColorMap: {
            blueviolet:             '#5F3936',
            violet:                 '#734951',
            taupe:                  '#8C7672',
            beige:                  '#BFB093',
            sand:                   '#D9D0A3',
            cream:                  '#FFFFD9',
            pink:                   '#C49489',
            brown:                  '#936A53',
            red:                    '#AD6D48',
            orange:                 '#FFC400',
            olive:                  '#B3B362',
            palegreen:              '#BBC996',
            green:                  '#A6F89D',
            cerulean:               '#51CCFF',
            aqua:                   '#049CDB',
            blue:                   '#0064CD'

            // Other possibilites
            //    '#BC8352',
            //    '#AD825B',
            //    '#BDA77A',
        },

        ColorFilter: function() {

            /*

             The Color Blind Simulation function is
             copyright (c) 2000-2001 by Matthew Wickline and the
             Human-Computer Interaction Resource Network ( http://hcirn.com/ ).

             It is used with the permission of Matthew Wickline and HCIRN,
             and is freely available for non-commercial use. For commercial use, please
             contact the Human-Computer Interaction Resource Network ( http://hcirn.com/ ).

             */

            var rBlind={'protan':{'cpu':0.735,'cpv':0.265,'am':1.273463,'ayi':-0.073894},
                'deutan':{'cpu':1.14,'cpv':-0.14,'am':0.968437,'ayi':0.003331},
                'tritan':{'cpu':0.171,'cpv':-0.003,'am':0.062921,'ayi':0.292119}};

            var fBlind={'Normal':function(v) { return(v); },
                'Protanopia':function(v) { return(blindMK(v,'protan')); },
                'Protanomaly':function(v) { return(anomylize(v,blindMK(v,'protan'))); },
                'Deuteranopia':function(v) { return(blindMK(v,'deutan')); },
                'Deuteranomaly':function(v) { return(anomylize(v,blindMK(v,'deutan'))); },
                'Tritanopia':function(v) { return(blindMK(v,'tritan')); },
                'Tritanomaly':function(v) { return(anomylize(v,blindMK(v,'tritan'))); },
                'Achromatopsia':function(v) { return(monochrome(v)); },
                'Achromatomaly':function(v) { return(anomylize(v,monochrome(v))); }};

            function blindMK(r,t) { var gamma=2.2, wx=0.312713, wy=0.329016, wz=0.358271;

                function Color() { this.rgb_from_xyz=xyz2rgb; this.xyz_from_rgb=rgb2xyz; }

                var b=r[2], g=r[1], r=r[0], c=new Color;

                c.r=Math.pow(r/255,gamma); c.g=Math.pow(g/255,gamma); c.b=Math.pow(b/255,gamma); c.xyz_from_rgb();

                var sum_xyz=c.x+c.y+c.z; c.u=0; c.v=0;

                if(sum_xyz!=0) { c.u=c.x/sum_xyz; c.v=c.y/sum_xyz; }

                var nx=wx*c.y/wy, nz=wz*c.y/wy, clm, s=new Color(), d=new Color(); d.y=0;

                if(c.u<rBlind[t].cpu) { clm=(rBlind[t].cpv-c.v)/(rBlind[t].cpu-c.u); } else { clm=(c.v-rBlind[t].cpv)/(c.u-rBlind[t].cpu); }

                var clyi=c.v-c.u*clm; d.u=(rBlind[t].ayi-clyi)/(clm-rBlind[t].am); d.v=(clm*d.u)+clyi;

                s.x=d.u*c.y/d.v; s.y=c.y; s.z=(1-(d.u+d.v))*c.y/d.v; s.rgb_from_xyz();

                d.x=nx-s.x; d.z=nz-s.z; d.rgb_from_xyz();

                var adjr=d.r?((s.r<0?0:1)-s.r)/d.r:0, adjg=d.g?((s.g<0?0:1)-s.g)/d.g:0, adjb=d.b?((s.b<0?0:1)-s.b)/d.b:0;

                var adjust=Math.max(((adjr>1||adjr<0)?0:adjr), ((adjg>1||adjg<0)?0:adjg), ((adjb>1||adjb<0)?0:adjb));

                s.r=s.r+(adjust*d.r); s.g=s.g+(adjust*d.g); s.b=s.b+(adjust*d.b);

                function z(v) { return(255*(v<=0?0:v>=1?1:Math.pow(v,1/gamma))); }

                return([z(s.r),z(s.g),z(s.b)]);

            }

            function rgb2xyz() {

                this.x=(0.430574*this.r+0.341550*this.g+0.178325*this.b);
                this.y=(0.222015*this.r+0.706655*this.g+0.071330*this.b);
                this.z=(0.020183*this.r+0.129553*this.g+0.939180*this.b);

                return this;

            }

            function xyz2rgb() {

                this.r=( 3.063218*this.x-1.393325*this.y-0.475802*this.z);
                this.g=(-0.969243*this.x+1.875966*this.y+0.041555*this.z);
                this.b=( 0.067871*this.x-0.228834*this.y+1.069251*this.z);

                return this;

            }

            function anomylize(a,b) { var v=1.75, d=v*1+1;

                return([(v*b[0]+a[0]*1)/d, (v*b[1]+a[1]*1)/d, (v*b[2]+a[2]*1)/d]);

            }

            function monochrome(r) { var z=Math.round(r[0]*.299+r[1]*.587+r[2]*.114); return([z,z,z]); }

            return {
                convert: function(filter, hexColor) {
                    var rgb = _.values($$u.colorutils.hexToRgb(hexColor));
                    var filteredRgb = fBlind[filter](rgb);
                    return $$u.colorutils.rgbToHex.apply($$u.colorutils, filteredRgb);
                }

            }
        }

    };

    $$u.colorutils = window.colorutils = colorutils;


//------------------------------------------------
//
//  ID UTILS
//
//------------------------------------------------
    var idutils = {

        generateUUID: function () {
            if (typeof(uuid) !== 'undefined') {
                return uuid.v4();
            }
            //We're in node.
            if (typeof window === 'undefined') {
                return require('node-uuid').v4();
            }
        },


        generateUniqueAlphaNumericShort: function () {
            return this.generateUniqueAlphaNumeric();
        },


        generateUniqueAlphaNumeric: function () {
            var val = ((new Date().getTime() * parseInt(Math.random() * 1000)) + new Date().getTime()).toString(36);
            if (val == NaN || val == undefined) {
                return this.generateUniqueAlphaNumeric();
            }
            return val;
        },


        isNewModelId: function(value) {
            return value == "" || value == null || value <= 0 || value == "00000000-0000-0000-0000-000000000000";
        },


        generateTimeStampId: function () {
            var msUTC = $$.u.dateutils.getUTCTime();
            return msUTC + "_" + new Date().getTimezoneOffset() + "_" + parseInt(Math.random() * 10000, 8).toString(36);
        },


        getTimeFromTimeStampId: function () {

        }
    };
    $$u.idutils = window.idutils = idutils;

    //------------------------------------------------
    //
    //  NUMBER UTILS
    //
    //------------------------------------------------

    /**
     * Validate that a value is a base10 integer; no 0xA or a0, etc. Returns NaN if not, otherwise returns the value.
     * @type {{strictParseInt: strictParseInt}}
     */
    var numberutils = {
        strictParseInt: function (value) {
            if(/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
                return Number(value);
            return NaN;
        },

        getRandomIntegerBetween: function(min, max) {
            return Math.floor(Math.random()*(max-min+1)+min);
        }
    };

    $$u.numberutils = window.numberutils = numberutils;

    //------------------------------------------------
    //
    //  NUMBER UTILS
    //
    //------------------------------------------------

    /**
     * Validate that a value is a base10 integer; no 0xA or a0, etc. Returns NaN if not, otherwise returns the value.
     * @type {{strictParseInt: strictParseInt}}
     */
    var numberutils = {
        strictParseInt: function (value) {
            if(/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
                return Number(value);
            return NaN;
        }
    };
    $$u.numberutils = window.numberutils = numberutils;

    //------------------------------------------------
//
//  DATE UTILS
//
//------------------------------------------------
    var dateutils = {
        stringToFunction: function (str) {
            var arr = str.split(".");

            var fn = (window || this);
            for (var i = 0, len = arr.length; i < len; i++) {
                fn = fn[arr[i]];
            }

            if (typeof fn !== "function") {
                throw new Error("function not found");
            }

            return fn;
        },


        toISODateString: function (d) {
            function pad(n) {
                return n < 10 ? '0' + n : n
            }

            return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + 'Z'
        },


        fromISO8601: function (string) {
            var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
                "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
                "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
            var d = string.match(new RegExp(regexp));

            var offset = 0;
            var date = new Date(d[1], 0, 1);

            if (d[3]) {
                date.setMonth(d[3] - 1);
            }
            if (d[5]) {
                date.setDate(d[5]);
            }
            if (d[7]) {
                date.setHours(d[7]);
            }
            if (d[8]) {
                date.setMinutes(d[8]);
            }
            if (d[10]) {
                date.setSeconds(d[10]);
            }
            if (d[12]) {
                date.setMilliseconds(Number("0." + d[12]) * 1000);
            }
            if (d[14]) {
                offset = (Number(d[16]) * 60) + Number(d[17]);
                offset *= ((d[15] == '-') ? 1 : -1);
            }

            offset -= date.getTimezoneOffset();
            var time = (Number(date) + (offset * 60 * 1000));

            var _d = new Date();
            _d.setTime(Number(time));
            return _d;
        },


        setMillisecondsSinceEpoch: function (string) {
            var d = new Date(parseInt(string));
            return d;
        },


        convertToDotNetDate: function (date) {
            if (this.isDotNetDate(date) == true) {
                return date;
            }

            if (date == null) {
                return null;
            }

            var isDate = Object.prototype.toString.call(date) == '[object Date]';
            if (isDate == true) {
                return "/Date(" + date.getTime() + ")/"
            }

            if (parseInt(date) != null && isNaN(parseInt(date)) == false) {
                return "/Date(" + parseInt(date) + ")/";
            }
            return null;
        },


        convertFromDotNetDate: function (dateString) {
            if (_.isDate(dateString)) {
                return dateString;
            }

            if (stringutils.isNullOrempty(dateString) == true) {
                return null;
            }
            var regExp = /[0-9]+/;
            var matches = dateString.match(regExp);
            if (matches.length > 0) {
                var milliseconds = matches[0];
                return dateutils.setMillisecondsSinceEpoch(milliseconds);
            }
            return null;
        },


        convertToLocalDateTime: function (dateTimeString) {
            if (_.isDate(dateTimeString)) {
                return dateTimeString;
            }

            if (stringutils.isNullOrempty(dateTimeString) == true) {
                return null;
            }
            var regExp = /[0-9]+/;
            var matches = dateTimeString.match(regExp);
            if (matches.length > 0) {
                var milliseconds = matches[0];
                var minuteInMilliSeconds = 60000;
                var dt = dateutils.setMillisecondsSinceEpoch(milliseconds);
                var timeZoneOffset = dt.getTimezoneOffset();
                var hourOffset = minuteInMilliSeconds * timeZoneOffset;
                dt = dateutils.setMillisecondsSinceEpoch(dt.getTime() - hourOffset);

                return dt;
            }
            return null;
        },


        convertFromDotNetDateShort: function (date) {
            var d = dateutils.convertFromDotNetDate(date);
            return d.format("mm-dd-yyyy");
        },

        convertFromDotNetDateShortForwardSlashed: function (date) {
            if (date == null) {
                return "";
            }

            var d = dateutils.convertFromDotNetDate(date);
            return d.format("mm/dd/yyyy");
        },


        isDotNetDate: function (dateString) {
            if (dateString != null && _.isString(dateString) && dateString.indexOf("/Date(") == 0) {
                return true;
            }
            return false;
        },

        isValidDate: function(d) {
            if ( Object.prototype.toString.call(d) !== "[object Date]" )
                return false;
            return !isNaN(d.getTime());
        },

        addDays: function(date, days) {
            if (date == null) {
                date = new Date();
            }

            var d = new Date(date.getTime());
            d.setDate(d.getDate() + days);
            return d;
        },

        dateDiff: function (date1, date2, unit) {

            if (date1 == null) {
                date1 = new Date();
            }

            if (date2 == null) {
                date2 = new Date();
            }

            if (_.isString(date1) == true && dateutils.isDotNetDate(date1)) {
                date1 = dateutils.convertFromDotNetDate(date1);
            }

            if (_.isString(date2) == true && dateutils.isDotNetDate(date2)) {
                date2 = dateutils.convertFromDotNetDate(date2);
            }

            var diff = date2.getTime() - date1.getTime();

            switch (unit) {
                case "millisecond":
                    //diff = diff;
                    break;
                case "second":
                    diff = diff / 1000;
                    break;
                case "minute":
                    diff = diff / (1000 * 60);
                    break;
                case "hour":
                    diff = diff / (1000 * 60 * 60);
                    break;
                case "day":
                    diff = diff / (1000 * 60 * 60 * 24);
                    break;
            }
            return diff;
        },


        cleanDate: function (date) {
            if (_.isDate(date) === true) {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
            }
            return date;
        }
    };
    $$u.dateutils = window.dateutils = dateutils;


//------------------------------------------------
//
//  FORMAT UTILS
//
//------------------------------------------------
    var formatutils = {
        formatSecondsAsMM_SS: function (value) {
            value = Math.round(value);
            if (value >= 60) {
                var minutes = Math.floor(value / 60);
                var seconds = Math.floor(value % 60);
            } else {
                minutes = 0;
                seconds = Math.round(value);
            }

            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            return minutes + ":" + seconds;
        },


        formatMinutesAsMM_SS: function (value) {
            var seconds = value * 60;
            return formatutils.formatSecondsAsMM_SS(seconds);
        },


        formatMoney: function (value) {
            var _value = parseFloat(value);
            if (stringutils.isNullOrempty(value) || isNaN(_value) == true) {
                return "$0.00";
            }

            return "$" + _value.toFixed(2);
        },


        formatMoneyAdvanced: function (value, places, symbol, thousand, decimal) {
            // Extend the default Number object with a formatMoney() method:
            // usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
            // defaults: (2, "$", ",", ".")
            places = !isNaN(places = Math.abs(places)) ? places : 2;
            symbol = symbol !== undefined ? symbol : "$";
            thousand = thousand || ",";
            decimal = decimal || ".";
            var number = parseFloat(value),
                negative = number < 0 ? "-" : "",
                i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
            return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
        }
    };
    $$u.formatutils = window.formatutils = formatutils;


//---------------------------------------------------------
//
//  REGEXP UTILS
//
//---------------------------------------------------------

    // Generally allowed special characters
    //
    var _allowedSpecialCharacters = [
        '@'
        , '#'
        , '%'
        , '&'
        , '!'
        , '='
        , '$'
        , '^'
        , '-'
        , '+'
        , '?'
        , '*'
    ];

    // Generally disallowed special characters: <, >, (, ), [, ], ', ", ;, :, /, |
    //
    var _forbiddenSpecialCharacters = [
        '<'
        , '>'
        , '('
        , ')'
        , '['
        , ']'
        , "'"
        , '"'
        , ';'
        , ':'
        , '/'
        , '|'
    ];

    var _escapeRegExp = function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };

    var regexutils = {

        allowedSpecialCharacters: _allowedSpecialCharacters,
        forbiddenSpecialCharacters: _forbiddenSpecialCharacters,
        escapeRegExp: _escapeRegExp,

        // At least one letter (uppercase or lowercase) AND one number or special character
        //
        LETTER_AND_NUMBER_OR_SPECIAL_CHARACTER:
            new RegExp(
                    // From beginning (make sure to perform match on full string)
                '^' +
                    // At least one letter, upper or lower
                '(?=.*[A-Za-z]{1,})' +
                    // At least one number OR special character
                '(?=.*([0-9]|[' + _escapeRegExp(_allowedSpecialCharacters.join("")) + ']){1,})' +
                    // Only allow numbers, letters and approved special characters
                '[\\d\\w' + _escapeRegExp(_allowedSpecialCharacters.join("")) + ']*' +
                    // Test to end of string (make sure to perform match on full string)
                '$'
            ),

        // At least one of each: uppercase letter, lowercase letter, number and special character (future use)
        //
        UPPER_AND_LOWER_AND_NUMBER_AND_SPECIAL_CHARACTER:
            new RegExp(
                    // From beginning (make sure to perform match on full string)
                '^' +
                    // At least one lowercase letter
                '(?=.*[a-z]{1,})' +
                    // At least one uppercase letter
                '(?=.*[A-Z]{1,})' +
                    // At least one number
                '(?=.*[0-9]{1,})' +
                    // At least one special character
                '(?=.*[' + _escapeRegExp(_allowedSpecialCharacters.join("")) + ']{1,})' +
                    // Only allow numbers, letters and approved special characters
                '[\\d\\w' + _escapeRegExp(_allowedSpecialCharacters.join("")) + ']*' +
                    // Test to end of string (make sure to perform match on full string)
                '$'
            ),

        // Harmful special characters associated with XSS & SQL attacks
        //
        HARMFUL_SPECIAL_CHARACTERS:
            new RegExp('[' + _escapeRegExp(_forbiddenSpecialCharacters.join("")) + ']'),


        ZIP_CODE: new RegExp(/(^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$)|(^\d{5}(-\d{4})?$)/)
    };
    $$u.regexutils = window.regexutils = regexutils;


//---------------------------------------------------------
//
//  URL UTILS
//
//--------------------------------------------------------
    var urlutils = {
        getUrlParam: function (name) {
            var url = new Url();

            return url.query[name];
            /*
             name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
             var regexS = "[\\?&]" + name + "=([^&#]*)";
             var regex = new RegExp(regexS);
             var results = regex.exec(window.location.search);
             if(results == null)
             return "";
             else
             return decodeURIComponent(results[1].replace(/\+/g, " "));
             */
        },


        parseAllQueryParams: function (queryParams) {
            if (queryParams == null || queryParams == "") {
                return {};
            }

            var str = "/placeholder?" + queryParams;

            var url = new Url(str);

            return url.query;
        }
    }
    $$u.urlutils = urlutils;

//---------------------------------------------------------
//
//  ARRAY UTILS
//
//---------------------------------------------------------
    var arrayutils = {
        convertArrayOfModelsToJsonArray: function (arr) {
            var ret = [];
            for (var i = 0, l = arr.length; i < l; i++) {
                ret.push(arr[i].toJSON());
            }
            return ret;
        },


        convertArrayOfJsonObjectsToModels: function (arr, modelInitializeFxn) {
            var ret = [];
            for (var i = 0, l = arr.length; i < l; i++) {
                var model = modelInitializeFxn();
                model.set(arr[i]);
                ret.push(model);
            }
            return ret;
        },


        findExclusiveItems: function (sourceArray, dirtyArray, property) {
            var ret = [];
            var length = sourceArray.length;
            if (property == null) {
                for (var i = 0; i < length; i++) {
                    if (dirtyArray.indexOf(sourceArray[i]) == -1) {
                        ret.push(sourceArray[i]);
                    }
                }
            } else {
                for (i = 0; i < length; i++) {
                    if (dirtyArray.findOne(property, sourceArray[i][property]) == null) {
                        ret.push(sourceArray[i]);
                    }
                }
            }
            return ret;
        }
    };
    $$u.arrayutils = window.arrayutils = arrayutils;

//--
//
//  TEXT UTILS
//
//--
    var textutils = {

        //region Text Decoration Utilities

        // These decoration utilities allow you to "decorate" text selected
        // by a user inside an HTML element (except for form elements)
        // with a CSS class. It works by wrapping the selected text with a
        // <span> tag, and adding the specified class to that <span>.
        //
        // It allows multiple decorations to be added to the same span of text
        // and it does so by nesting <span>s. It does NOT allow overlapping
        // decorations though, as that would blow up the HTML document.
        //
        // Also, to remove a decoration, the user need not exactly re-create
        // the original selection, but instead must only select at least part
        // of the original selection--again though, this selection must not
        // include text outside the original selection, as that would be
        // an overlapping situation.
        //
        // To add a new kind of decoration, simply duplicate a
        // function like toggleHighlight(), replacing it with a
        // CSS class name defined in site.less
        //
        toggleHighlight: function () {
            this.toggleDecoration("zhighlightz");
        },

        toggleStrikeThrough: function () {
            this.toggleDecoration("zstrikethroughz");
        },

        toggleDecoration: function (decorationClass) {
            if (this.isSelectionDecorated(decorationClass)) {
                this.removeDecorationFromSelection(decorationClass);
            } else {
                this.decorateSelection(decorationClass);
            }
        },

        isSelectionDecorated: function(decorationClass) {
            var selection = this.getSelection();
            var $parent = $(selection.focusNode.parentElement);
            return $parent.hasClass(decorationClass) || $parent.parents("span").hasClass(decorationClass);
        },

        /**
         * Add decoration to current selection
         * @param decorationClass   - CSS class to decorate with
         */
        decorateSelection: function (decorationClass) {
            var selection = this.getSelection();
            var range = this.getSelectionRange(selection);

            if (this.isValidSelectionRange(selection, range))
            {
                var ranges = this.getRangesFromSelection(selection);

                _.each(ranges, function(range) {
                    this.decorateRange(range, decorationClass);
                }, this);

                // End the selection
                //
                this.emptySelection();
            }
        },


        /**
         * Remove decoration from selected text
         * @param decorationClass   - CSS class decoration to remove
         */
        removeDecorationFromSelection: function(decorationClass) {

            // Get the selection
            //
            var selection = this.getSelection();
            var range = this.getSelectionRange(selection);

            // Figure out the first and last selected nodes.
            // Normally these are anchorNode and focusNode, respectively,
            // but if the user creates a selection by dragging from right
            // to left, these will be backwards. So we'll switch them
            // if that's the case to avoid confusion.
            //
            var anchorNode = selection.anchorNode;
            var anchorOffset = selection.anchorOffset;
            var focusNode = selection.focusNode;
            var focusOffset = selection.focusOffset;
            var anchorIndex, focusIndex

            var childNodes = [];
            this.invokeOnAllDescendants(range.commonAncestorContainer, function(child) {
                if (child.nodeType == 3) {
                    childNodes.push(child)
                }
            });

            for (var i = 0; i < childNodes.length; ++i) {
                if (anchorNode == childNodes[i])
                    anchorIndex = i;
                if (focusNode == childNodes[i])
                    focusIndex = i;
            }

            if (anchorIndex > focusIndex || anchorNode == focusNode && anchorOffset > focusOffset) {
                var tmpNode = anchorNode;
                anchorNode = focusNode;
                focusNode = tmpNode;

                var tmpOffset = anchorOffset;
                anchorOffset = focusOffset;
                focusOffset = tmpOffset;
            }

            // Create a range that extends from the beginning of the
            // focus node to the beginning of the selection
            //
            var beforeAnchorRange = document.createRange();
            beforeAnchorRange.setStart(anchorNode, 0);
            beforeAnchorRange.setEnd(anchorNode, anchorOffset);

            // Create a range that extends from the end of the
            // selection to the end of the focus node
            //
            var afterFocusRange = document.createRange();
            afterFocusRange.setStart(focusNode, focusOffset);
            afterFocusRange.setEnd(focusNode, focusNode.length);

            // Find the closest parent with the same decoration as we're removing
            // for each of the anchor and focus nodes.
            //
            var $anchorParent = $(selection.anchorNode.parentElement);
            var $anchorDecoration = $anchorParent.closest("span." + decorationClass);
            var $focusParent = $(selection.focusNode.parentElement);
            var $focusDecoration = $focusParent.closest("span." + decorationClass);

            if ($anchorDecoration.length == $focusDecoration.length && $anchorDecoration[0] == $focusDecoration[0]) {
                // Here, both the anchor and focus nodes are wrapped in the same decoration.
                // So decorate all it's text children.
                //
                this.decorateTextChildren($anchorDecoration, decorationClass);

                // Now decorate the parts of the anchor and focus nodes that aren't selected
                //
                this.decorateRange(beforeAnchorRange, decorationClass);
                this.decorateRange(afterFocusRange, decorationClass);

                // Finally, replace the decorating parent with it's children,
                // thereby removing that decorating, and leaving only the un-selected
                // children decorated with that decoration.
                //
                $anchorDecoration.replaceWith($anchorDecoration[0].childNodes);

                // From the surrounding nodes, remove empty text nodes,
                // and combine adjacent text nodes into a single text node
                //
                $anchorDecoration[0].normalize();
            }
            else {
                // Here, the anchor and focus nodes do not have a common decorating parent.
                // Instead, we'll get a list of all such parents of any selected nodes, and
                // process those similarly to the way we did a common decorating parent, above.

                // First get all selected text nodes with a parent decorated the same
                // as the decoration we're trying to remove.
                //
                var selectedTextNodes = _.filter(this.getSelectedNodes(), function(node) {
                    return node.nodeType == 3 && $(node).closest("span." + decorationClass).length;
                });

                // Now get a list of these decorated parents
                //
                var selectedTextParents = _.map(selectedTextNodes, function(node) {
                    return $(node).closest("span." + decorationClass)
                });

                // For each one of these, decorate all of it's text children
                //
                _.each(selectedTextParents, function($decoration) {
                    this.decorateTextChildren($decoration, decorationClass);
                }, this);

                // Now decorate the parts of the anchor and focus nodes that aren't selected
                //
                this.decorateRange(afterFocusRange, decorationClass);
                this.decorateRange(beforeAnchorRange, decorationClass);

                // Finally, replace each of the decorating parents with their children,
                // thereby removing that decorating, and leaving only the un-selected
                // children decorated with that decoration.
                //
                _.each(selectedTextParents, function($decoration) {
                    $decoration.replaceWith($decoration[0].childNodes);

                    // From the surrounding nodes, remove empty text nodes,
                    // and combine adjacent text nodes into a single text node
                    //
                    $anchorDecoration[0].normalize();
                });

            }

            // End the selection
            //
            this.emptySelection();

        },

        /**
         * Decorate each of the text descendants individually
         * @param $parent           - Parent whose text node children should be decorated
         * @param decorationClass   - CSS class to decorate them with
         */
        decorateTextChildren: function($parent, decorationClass) {
            // re-decorate those
            // then replace the anchorDecoration with it's contents
            // Get all the child text nodes of this decorating parent, filtering
            //
            var parentNode = $parent[0];
            var textChildren = [];

            this.invokeOnAllDescendants(parentNode, function(child) {
                if (child.nodeType == 3) {
                    textChildren.push(child)
                }
            });

            // Filter out any selected nodes
            //
            var redecorateChildren = _.reject(textChildren, function(child) {
                return _.contains(this.getSelectedNodes(), child);
            }, this);

            this.decorateNodes(redecorateChildren, decorationClass);
        },

        /**
         * Decorate a list of nodes
         * @param nodes
         * @param decorationClass
         */
        decorateNodes: function(nodes, decorationClass) {
            _.each(nodes, function(node) {
                var newRange = document.createRange();
                newRange.selectNode(node);
                this.decorateRange(newRange, decorationClass);
            }, this);
        },

        /**
         * Decorate a single range
         * @param range
         * @param decorationClass
         */
        decorateRange: function(range, decorationClass) {

            // Wrap the selected text in a <span> with the specified decorator class
            //
            var span = document.createElement('span');
            span.className = decorationClass + " user-text-decoration";

            if (range.toString().length) {
                range.surroundContents(span);
            }

            // Remove any <span> tags of the same class that are nested within
            // the new wrapper, since this would result in a "double" decoration,
            // requiring the user to un-decorate it twice, which could be confusing.
            //
            $(span).find("span." + decorationClass).each(function() {
                $(this).replaceWith(this.childNodes);
            });

            // Remove empty text nodes, and combine adjacent text nodes into a single text node
            //
            span.normalize();
        },

        /**
         * Invoke a function on all descendants of a node
         * @param node  - Parent node
         * @param func  - Function to invoke
         */
        invokeOnAllDescendants: function (node, func) {
            for (var i = 0; i < node.childNodes.length; i++) {
                var child = node.childNodes[i];
                this.invokeOnAllDescendants(child, func);
                func(child);
            }
        },

        /**
         * Build an array of wrappable Range objects from a selection
         * @param selection
         * @returns {Array}
         */
        getRangesFromSelection: function (selection) {
            var selectionRange = this.getSelectionRange(selection);
            var ranges = [];

            var startRange = document.createRange();
            startRange.selectNode(selectionRange.startContainer);
            startRange.setStart(selectionRange.startContainer, selectionRange.startOffset);
            ranges.push(startRange);

            if (selectionRange.startContainer == selectionRange.endContainer) {
                startRange.setEnd(selectionRange.endContainer, selectionRange.endOffset);
            }
            else {
                var endRange = document.createRange();
                endRange.selectNode(selectionRange.endContainer);
                endRange.setEnd(selectionRange.endContainer, selectionRange.endOffset);
                ranges.push(endRange);
            }

            var nodes = this.getSelectedNodes();

            _.each(nodes, function (node) {
                var newRange = document.createRange();
                newRange.selectNode(node);

                // Don't re-push the start and end container nodes, since they're already here
                //
                if ( ! (node.contains(selectionRange.endContainer) || node.contains(selectionRange.startContainer))) {

                    var wrappableDisplayTypes = ["inline", "block"];

                    // Check the node to make sure it is a text node (3) or that is either an inline or block-level
                    // element; Trying to wrap other display types (<li>, <tr>, etc) breaks the DOM.
                    //
                    var checkNode = node.nodeType == 3 || _.contains(wrappableDisplayTypes, this.getElementDefaultDisplay(node.tagName));

                    // Similarly, trying to wrap the empty space that often exists between non-inline/block elements
                    // in a span also breaks the DOM. So check that the node either doesn't have a next/previous
                    // sibling element or that the next/previous sibling element is an inline or block-level element.
                    //
                    var checkNextSibling = !node.nextElementSibling
                            || _.contains(wrappableDisplayTypes, this.getElementDefaultDisplay(node.nextElementSibling.tagName))
                    ;
                    var checkPreviousSibling = !node.previousElementSibling
                            || _.contains(wrappableDisplayTypes, this.getElementDefaultDisplay(node.previousElementSibling.tagName))
                    ;

                    if (checkNode && checkNextSibling && checkPreviousSibling) {
                        ranges.push(newRange);
                    }
                }
            }, this);

            return ranges;
        },

        /**
         * Determine an element's default display type
         * @param tag
         * @returns {CSSStyleDeclaration.display|*}
         */
        getElementDefaultDisplay: function(tag) {
            var cStyle,
                t = document.createElement(tag),
                gcs = "getComputedStyle" in window;

            document.body.appendChild(t);
            cStyle = (gcs ? window.getComputedStyle(t, "") : t.currentStyle).display;
            document.body.removeChild(t);

            return cStyle;
        },


        /**
         * Return an array of nodes in the current selection
         * @returns {*}
         */
        getSelectedNodes: function () {
            var selection = this.getSelection();
            if (! selection.isCollapsed) {
                return this.getSelectedNodesFromRange(selection.getRangeAt(0));
            }
            return [];
        },

        /**
         * Get an array of the selected nodes in  a range
         * @param range
         * @returns {*}
         */
        getSelectedNodesFromRange: function(range) {
            var node = range.startContainer;
            var endNode = range.endContainer;

            // Special case for a range that is contained within a single node
            //
            if (node == endNode) {
                return [node];
            }

            // Iterate nodes until we hit the end container
            //
            var rangeNodes = [];
            while (node && node != endNode) {
                rangeNodes.push( node = this.nextNode(node) );
            }

            // Add partially selected nodes at the start of the range
            //
            node = range.startContainer;
            while (node && node != range.commonAncestorContainer) {
                rangeNodes.unshift(node);
                node = node.parentNode;
            }

            return rangeNodes;
        },

        /**
         * Node iterator
         * @param node
         * @returns {*}
         */
        nextNode: function(node) {
            if (node.hasChildNodes()) {
                return node.firstChild;
            } else {
                while (node && !node.nextSibling) {
                    node = node.parentNode;
                }
                if (!node) {
                    return null;
                }
                return node.nextSibling;
            }
        },

        /**
         * Select a range of text
         * @param selector      - HTML element selector that contains text to be selected
         * @param startWord     - string where the selection should start
         * @param endWord       - string where the selection should end
         */
        setSelection: function(selector, startWord, endWord){

            this.emptySelection();

            var childNodes = [];
            this.invokeOnAllDescendants($(selector)[0], function(child) {
                childNodes.push(child)
            });

            var startOffset = 0, endOffset = 0;

            var startNode = _.find(childNodes, function(node) {
                return node.nodeType == 3 && (startOffset = node.data.indexOf(startWord)) > -1;
            });

            var endNode = _.find(childNodes, function(node) {
                return node.nodeType == 3 && (endOffset = node.data.indexOf(endWord)) > -1;
            });

            endOffset = endOffset + endWord.length;

            var range = document.createRange();
            range.setStart(startNode, startOffset);
            range.setEnd(endNode, endOffset);

            var selection = window.getSelection();
            selection.addRange(range);

        },

        /**
         * Get current selection; should be cross-browser
         * @returns {Selection}
         */
        getSelection: function() {
            if (window.getSelection) {
                return window.getSelection();
            }
            else if (document.selection && document.selection.type != "Control") {
                return document.selection;
            }
        },

        /**
         * Get the range spanning a selection
         * @param selection
         * @returns {Range}
         */
        getSelectionRange: function(selection) {
            return selection.getRangeAt(0);
        },

        /**
         * Determine if selection is valid
         * @param selection     - A Selection object; defaults to current selection
         * @param range         - A Range object; defaults to range of current selection
         * @returns {boolean|*|Range}
         */
        isValidSelectionRange: function(selection, range) {
            // If no selection is passed in, get the current one
            //
            selection = selection || this.getSelection();

            return !selection.isCollapsed && (range || this.getSelectionRange(selection));
        },

        /**
         * Destroy the current selection
         */
        emptySelection: function() {
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }
            else if (document.selection) {
                document.selection.empty();
            }
        }

        //endregion Text Decoration Utilities
    };
    $$u.textutils = window.textutils = textutils;

//---------------------------------------------------------
//  NEW METHODS ON ARRAY PROTOTYPE
//---------------------------------------------------------
    Array.prototype.findOne = function (property, value, loose) {
        var length = this.length;
        if (loose) {
            for (var i = 0; i < length; i++) {
                if (this[i][property] == value) {
                    return this[i];
                }
            }
        } else {
            for (var i = 0; i < length; i++) {
                if (this[i][property] === value) {
                    return this[i];
                }
            }
        }
        return null;
    }


    Array.prototype.findLast = function (property, value, loose) {
        var length = this.length;
        if (loose) {
            for (var i = length - 1; i >= length; i--) {
                if (this[i][property] == value) {
                    return this[i];
                }
            }
        } else {
            for (var i = length - 1; i >= length; i--) {
                if (this[i][property] === value) {
                    return this[i];
                }
            }
        }

        return null;
    }


    Array.prototype.findAll = function (property, value, loose) {
        var length = this.length;
        var ret = [];
        if (loose) {
            for (var i = 0; i < length; i++) {
                if (this[i][property] == value) {
                    ret.push(this[i]);
                }
            }
        } else {
            for (var i = 0; i < length; i++) {
                if (this[i][property] === value) {
                    ret.push(this[i]);
                }
            }
        }
        return ret;
    }


    Array.prototype.getIndex = function (property, value, loose) {
        var length = this.length;
        var ret = [];
        if (loose) {
            for (var i = 0; i < length; i++) {
                if (this[i][property] == value) {
                    return i;
                }
            }
        } else {
            for (var i = 0; i < length; i++) {
                if (this[i][property] === value) {
                    return i;
                }
            }
        }
        return -1;
    }


    Array.prototype.indexOf = Array.prototype.indexOf || function (item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) return i
        }
        return -1;
    }

});


