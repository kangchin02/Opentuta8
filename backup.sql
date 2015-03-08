CREATE DATABASE  IF NOT EXISTS `laravel` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `laravel`;
-- MySQL dump 10.13  Distrib 5.6.17, for Win32 (x86)
--
-- Host: localhost    Database: laravel
-- ------------------------------------------------------
-- Server version	5.6.21-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assigned_roles`
--

DROP TABLE IF EXISTS `assigned_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assigned_roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `role_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `assigned_roles_user_id_index` (`user_id`),
  KEY `assigned_roles_role_id_index` (`role_id`),
  CONSTRAINT `assigned_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `assigned_roles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assigned_roles`
--

LOCK TABLES `assigned_roles` WRITE;
/*!40000 ALTER TABLE `assigned_roles` DISABLE KEYS */;
INSERT INTO `assigned_roles` VALUES (1,1,1),(2,2,2);
/*!40000 ALTER TABLE `assigned_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `post_id` int(10) unsigned NOT NULL,
  `content` text COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `comments_user_id_index` (`user_id`),
  KEY `comments_post_id_index` (`post_id`),
  CONSTRAINT `comments_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,1,1,'Lorem ipsum dolor sit amet, mutat utinam nonumy ea mel.','2015-01-27 23:01:42','2015-01-27 23:01:42'),(2,1,1,'Lorem ipsum dolor sit amet, sale ceteros liberavisse duo ex, nam mazim maiestatis dissentiunt no. Iusto nominavi cu sed, has.','2015-01-27 23:01:42','2015-01-27 23:01:42'),(3,1,1,'Et consul eirmod feugait mel! Te vix iuvaret feugiat repudiandae. Solet dolore lobortis mei te, saepe habemus imperdiet ex vim. Consequat signiferumque per no, ne pri erant vocibus invidunt te.','2015-01-27 23:01:42','2015-01-27 23:01:42'),(4,1,2,'Lorem ipsum dolor sit amet, mutat utinam nonumy ea mel.','2015-01-27 23:01:42','2015-01-27 23:01:42'),(5,1,2,'Lorem ipsum dolor sit amet, sale ceteros liberavisse duo ex, nam mazim maiestatis dissentiunt no. Iusto nominavi cu sed, has.','2015-01-27 23:01:42','2015-01-27 23:01:42'),(6,1,3,'Lorem ipsum dolor sit amet, mutat utinam nonumy ea mel.','2015-01-27 23:01:42','2015-01-27 23:01:42');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES ('2013_02_05_024934_confide_setup_users_table',1),('2013_02_05_043505_create_posts_table',1),('2013_02_05_044505_create_comments_table',1),('2013_02_08_031702_entrust_setup_tables',1),('2013_05_21_024934_entrust_permissions',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reminders`
--

DROP TABLE IF EXISTS `password_reminders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reminders` (
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reminders`
--

LOCK TABLES `password_reminders` WRITE;
/*!40000 ALTER TABLE `password_reminders` DISABLE KEYS */;
INSERT INTO `password_reminders` VALUES ('test@gmail.com','373e72a5ec414aa163245c5f029e0607','2015-03-07 05:21:50'),('test@gmail.com','bf2296b87f34ca2010bf0df18a6afdd1','2015-03-07 05:25:29'),('pchin03@gmail.com','282ebc930a367c4649a859b1104b90df','2015-03-07 05:45:27'),('test@gmail.com','af740c706344812f14a83e0b4049044a','2015-03-07 06:02:28'),('test@gmail.com','f4a383910bd9a23b5e9d25280c3a72d8','2015-03-07 06:57:47'),('test@gmail.com','bfb8802b95d3f9c024af4b51803d77dc','2015-03-07 07:05:18'),('test@gmail.com','55968a947d8bc323e0d8f2459caa4748','2015-03-07 07:09:13'),('pchin03@gmail.com','91f5dd741805ee182dcb1d1a21eff4f7','2015-03-07 07:09:59'),('pchin03@gmail.com','ca0c331fb7c98895c8c773e33f93c631','2015-03-07 07:13:18');
/*!40000 ALTER TABLE `password_reminders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission_role`
--

DROP TABLE IF EXISTS `permission_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permission_role` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `permission_id` int(10) unsigned NOT NULL,
  `role_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permission_role_permission_id_role_id_unique` (`permission_id`,`role_id`),
  KEY `permission_role_permission_id_index` (`permission_id`),
  KEY `permission_role_role_id_index` (`role_id`),
  CONSTRAINT `permission_role_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `permission_role_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission_role`
--

LOCK TABLES `permission_role` WRITE;
/*!40000 ALTER TABLE `permission_role` DISABLE KEYS */;
INSERT INTO `permission_role` VALUES (1,1,1),(2,2,1),(3,3,1),(4,4,1),(5,5,1),(6,6,1),(7,6,2);
/*!40000 ALTER TABLE `permission_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `display_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_unique` (`name`),
  UNIQUE KEY `permissions_display_name_unique` (`display_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'manage_blogs','manage blogs'),(2,'manage_posts','manage posts'),(3,'manage_comments','manage comments'),(4,'manage_users','manage users'),(5,'manage_roles','manage roles'),(6,'post_comment','post comment');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `content` text COLLATE utf8_unicode_ci NOT NULL,
  `meta_title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `meta_description` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `meta_keywords` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `posts_user_id_index` (`user_id`),
  CONSTRAINT `posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,1,'Lorem ipsum dolor sit amet','lorem-ipsum-dolor-sit-amet','In mea autem etiam menandri, quot elitr vim ei, eos semper disputationi id? Per facer appetere eu, duo et animal maiestatis. Omnesque invidunt mnesarchum ex mel, vis no case senserit dissentias. Te mei minimum singulis inimicus, ne labores accusam necessitatibus vel, vivendo nominavi ne sed. Posidonium scriptorem consequuntur cum ex? Posse fabulas iudicabit in nec, eos cu electram forensibus, pro ei commodo tractatos reformidans. Qui eu lorem augue alterum, eos in facilis pericula mediocritatem?\n\nEst hinc legimus oporteat in. Sit ei melius delicatissimi. Duo ex qualisque adolescens! Pri cu solum aeque. Aperiri docendi vituperatoribus has ea!\n\nSed ut ludus perfecto sensibus, no mea iisque facilisi. Choro tation melius et mea, ne vis nisl insolens. Vero autem scriptorem cu qui? Errem dolores no nam, mea tritani platonem id! At nec tantas consul, vis mundi petentium elaboraret ex, mel appareat maiestatis at.\n\nSed et eros concludaturque. Mel ne aperiam comprehensam! Ornatus delicatissimi eam ex, sea an quidam tritani placerat? Ad eius iriure consequat eam, mazim temporibus conclusionemque eum ex.\n\nTe amet sumo usu, ne autem impetus scripserit duo, ius ei mutat labore inciderint! Id nulla comprehensam his? Ut eam deleniti argumentum, eam appellantur definitionem ad. Pro et purto partem mucius!\n\nCu liber primis sed, esse evertitur vis ad. Ne graeco maiorum mea! In eos nostro docendi conclusionemque. Ne sit audire blandit tractatos? An nec dicam causae meliore, pro tamquam offendit efficiendi ut.\n\nTe dicta sadipscing nam, denique albucius conclusionemque ne usu, mea eu euripidis philosophia! Qui at vivendo efficiendi! Vim ex delenit blandit oportere, in iriure placerat cum. Te cum meis altera, ius ex quis veri.\n\nMutat propriae eu has, mel ne veri bonorum tincidunt. Per noluisse sensibus honestatis ut, stet singulis ea eam, his dicunt vivendum mediocrem ei. Ei usu mutat efficiantur, eum verear aperiam definitiones an! Simul dicam instructior ius ei. Cu ius facer doming cotidieque! Quot principes eu his, usu vero dicat an.\n\nEx dicta perpetua qui, pericula intellegam scripserit id vel. Id fabulas ornatus necessitatibus mel. Prompta dolorem appetere ea has. Vel ad expetendis instructior!\n\nTe his dolorem adversarium? Pri eu rebum viris, tation molestie id pri. Mel ei stet inermis dissentias. Sed ea dolorum detracto vituperata. Possit oportere similique cu nec, ridens animal quo ex?','meta_title1','meta_description1','meta_keywords1','2015-01-27 23:01:42','2015-01-27 23:01:42'),(2,1,'Vivendo suscipiantur vim te vix','vivendo-suscipiantur-vim-te-vix','In mea autem etiam menandri, quot elitr vim ei, eos semper disputationi id? Per facer appetere eu, duo et animal maiestatis. Omnesque invidunt mnesarchum ex mel, vis no case senserit dissentias. Te mei minimum singulis inimicus, ne labores accusam necessitatibus vel, vivendo nominavi ne sed. Posidonium scriptorem consequuntur cum ex? Posse fabulas iudicabit in nec, eos cu electram forensibus, pro ei commodo tractatos reformidans. Qui eu lorem augue alterum, eos in facilis pericula mediocritatem?\n\nEst hinc legimus oporteat in. Sit ei melius delicatissimi. Duo ex qualisque adolescens! Pri cu solum aeque. Aperiri docendi vituperatoribus has ea!\n\nSed ut ludus perfecto sensibus, no mea iisque facilisi. Choro tation melius et mea, ne vis nisl insolens. Vero autem scriptorem cu qui? Errem dolores no nam, mea tritani platonem id! At nec tantas consul, vis mundi petentium elaboraret ex, mel appareat maiestatis at.\n\nSed et eros concludaturque. Mel ne aperiam comprehensam! Ornatus delicatissimi eam ex, sea an quidam tritani placerat? Ad eius iriure consequat eam, mazim temporibus conclusionemque eum ex.\n\nTe amet sumo usu, ne autem impetus scripserit duo, ius ei mutat labore inciderint! Id nulla comprehensam his? Ut eam deleniti argumentum, eam appellantur definitionem ad. Pro et purto partem mucius!\n\nCu liber primis sed, esse evertitur vis ad. Ne graeco maiorum mea! In eos nostro docendi conclusionemque. Ne sit audire blandit tractatos? An nec dicam causae meliore, pro tamquam offendit efficiendi ut.\n\nTe dicta sadipscing nam, denique albucius conclusionemque ne usu, mea eu euripidis philosophia! Qui at vivendo efficiendi! Vim ex delenit blandit oportere, in iriure placerat cum. Te cum meis altera, ius ex quis veri.\n\nMutat propriae eu has, mel ne veri bonorum tincidunt. Per noluisse sensibus honestatis ut, stet singulis ea eam, his dicunt vivendum mediocrem ei. Ei usu mutat efficiantur, eum verear aperiam definitiones an! Simul dicam instructior ius ei. Cu ius facer doming cotidieque! Quot principes eu his, usu vero dicat an.\n\nEx dicta perpetua qui, pericula intellegam scripserit id vel. Id fabulas ornatus necessitatibus mel. Prompta dolorem appetere ea has. Vel ad expetendis instructior!\n\nTe his dolorem adversarium? Pri eu rebum viris, tation molestie id pri. Mel ei stet inermis dissentias. Sed ea dolorum detracto vituperata. Possit oportere similique cu nec, ridens animal quo ex?','meta_title2','meta_description2','meta_keywords2','2015-01-27 23:01:42','2015-01-27 23:01:42'),(3,1,'In iisque similique reprimique eum','in-iisque-similique-reprimique-eum','In mea autem etiam menandri, quot elitr vim ei, eos semper disputationi id? Per facer appetere eu, duo et animal maiestatis. Omnesque invidunt mnesarchum ex mel, vis no case senserit dissentias. Te mei minimum singulis inimicus, ne labores accusam necessitatibus vel, vivendo nominavi ne sed. Posidonium scriptorem consequuntur cum ex? Posse fabulas iudicabit in nec, eos cu electram forensibus, pro ei commodo tractatos reformidans. Qui eu lorem augue alterum, eos in facilis pericula mediocritatem?\n\nEst hinc legimus oporteat in. Sit ei melius delicatissimi. Duo ex qualisque adolescens! Pri cu solum aeque. Aperiri docendi vituperatoribus has ea!\n\nSed ut ludus perfecto sensibus, no mea iisque facilisi. Choro tation melius et mea, ne vis nisl insolens. Vero autem scriptorem cu qui? Errem dolores no nam, mea tritani platonem id! At nec tantas consul, vis mundi petentium elaboraret ex, mel appareat maiestatis at.\n\nSed et eros concludaturque. Mel ne aperiam comprehensam! Ornatus delicatissimi eam ex, sea an quidam tritani placerat? Ad eius iriure consequat eam, mazim temporibus conclusionemque eum ex.\n\nTe amet sumo usu, ne autem impetus scripserit duo, ius ei mutat labore inciderint! Id nulla comprehensam his? Ut eam deleniti argumentum, eam appellantur definitionem ad. Pro et purto partem mucius!\n\nCu liber primis sed, esse evertitur vis ad. Ne graeco maiorum mea! In eos nostro docendi conclusionemque. Ne sit audire blandit tractatos? An nec dicam causae meliore, pro tamquam offendit efficiendi ut.\n\nTe dicta sadipscing nam, denique albucius conclusionemque ne usu, mea eu euripidis philosophia! Qui at vivendo efficiendi! Vim ex delenit blandit oportere, in iriure placerat cum. Te cum meis altera, ius ex quis veri.\n\nMutat propriae eu has, mel ne veri bonorum tincidunt. Per noluisse sensibus honestatis ut, stet singulis ea eam, his dicunt vivendum mediocrem ei. Ei usu mutat efficiantur, eum verear aperiam definitiones an! Simul dicam instructior ius ei. Cu ius facer doming cotidieque! Quot principes eu his, usu vero dicat an.\n\nEx dicta perpetua qui, pericula intellegam scripserit id vel. Id fabulas ornatus necessitatibus mel. Prompta dolorem appetere ea has. Vel ad expetendis instructior!\n\nTe his dolorem adversarium? Pri eu rebum viris, tation molestie id pri. Mel ei stet inermis dissentias. Sed ea dolorum detracto vituperata. Possit oportere similique cu nec, ridens animal quo ex?','meta_title3','meta_description3','meta_keywords3','2015-01-27 23:01:42','2015-01-27 23:01:42');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','2015-01-27 23:01:43','2015-01-27 23:01:43'),(2,'comment','2015-01-27 23:01:43','2015-01-27 23:01:43');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `confirmation_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `remember_token` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `confirmed` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@example.org','$2y$10$px.Th3KWjil/YzQRxwJw8ON7yk5R7xZAI5GO5ne3bWOAuASukru3q','fa6b7178e2d1e175d1dfc86ac48b7c36','hZytSQvO11hV2iys8li58KgggAmvid0gPxcrIDbtgA08dAiaU8gZGcyWJTNF',1,'2015-01-27 23:01:42','2015-02-23 05:11:03'),(2,'user','user@example.org','$2y$10$gCUKTQ6KJbAtLv0dx8uUZuG7uCOjNjpcNf8npb5MNu0EPHIHeYEYK','f00df8a7028173f44ae200be7753a1b7','ABSc6fB8OmnCiHGKi03921EqOET6IlmWoCVCUyARTb1IZDh3LEp9AkodhMbR',1,'2015-01-27 23:01:42','2015-02-10 09:29:35'),(3,'test','test@gmail.com','$2y$10$EDR30zcczRnglZeMK.KLE.X9fdDhd2GnigR/g63gCFraG0wE0l.6u','6b227167a2a5cde7f662cedc19838a53',NULL,1,'2015-03-01 21:48:14','2015-03-01 21:48:14'),(4,'test2','test2@gmail.com','$2y$10$moTxUaTvLaIDdPhRYyOBj.MC0LJoUnxBjeoJqo4AV5vBfP8c.UYPK','6627973e8713ee04e9252be2f1500d12',NULL,1,'2015-03-02 05:54:11','2015-03-02 05:54:11'),(5,'test3','test3@gmail.com','$2y$10$grQj4OhSV43bEAiV2sYVwe9vvEY0Se66bLyuilD0qzT3oyrVAfYDW','88bbe72142098cd1e5d446688d801f11',NULL,1,'2015-03-02 05:57:04','2015-03-02 05:57:04'),(6,'test4','test4@gmail.com','$2y$10$IyQVc1BB1buh5HtHUXtuVODpWomiAN37iAs5n74GbHfYx4cm/PeMG','3a8ec1bd1327af97fd575f617e986c5b',NULL,1,'2015-03-02 05:58:31','2015-03-02 05:58:31'),(7,'test5','test5@gmail.com','$2y$10$tfKRiU0hyixTH4kWIW7Puufzfj6GracGbAwE2x7cqnma/0qG/1LDK','8d5b773df73930db06fc03bd42706428',NULL,1,'2015-03-02 06:05:04','2015-03-02 06:05:04'),(8,'test6','test6@gmail.com','$2y$10$XWSLLyE/Hp8.Di8aQf18kuyjLwEO.kvHWpmgUgd.Sgo5pmiv31xkm','677a7ec84482a0d199dd4fafa8355576',NULL,1,'2015-03-02 06:19:46','2015-03-02 06:19:46'),(9,'test7','test7@gmail.com','$2y$10$IdtxOuZXjHf3b9gGi3ZXOO2wsL.esen86CknXyCH248eseB2c1j6O','9b2e38a0755cfca155a38bfa8db69acc',NULL,1,'2015-03-02 07:27:19','2015-03-02 07:27:19'),(10,'test8','test8@gmail.com','$2y$10$o.MpBdqpIJ3V3BUQvjP/He0ltASzxYAE9I2RKJmjzIM6Y8IyKS81a','9b5e1591d6d09ee15e6f19100b1fb169',NULL,1,'2015-03-02 07:28:24','2015-03-02 07:28:24'),(11,'test9','test9@gmail.com','$2y$10$hvdbmbny3Nukd.vJ2DCtiON202hZpR2ul0ZUJi6SAkN1Y3QVPV29C','796e69951c70a6d1da60e9094eb43651',NULL,1,'2015-03-02 07:28:53','2015-03-02 07:28:53'),(12,'test10','test10@gmail.com','$2y$10$CkG34M9hsUcPe43r7nntU.65C/oW9O.Q4p/ZI.YRYV41OByxRxfYS','efa53c1e7793b2975485224828314c47',NULL,1,'2015-03-02 07:48:38','2015-03-02 07:48:38'),(13,'test11','test11@gmail.com','$2y$10$L.7VJ5.4rP0QopGJIGdV8OTkgd/awqUDDI2PKCboQXmHCPI6CJTsu','a20d9023b47501f352721840dd5a0ad0',NULL,1,'2015-03-02 07:51:11','2015-03-02 07:51:11'),(14,'test12','test12@gmail.com','$2y$10$Xo6IaBGfegfKRvPSkgD2ZuucESMkB6VU3g2KwzBI0dwAB.UjvtgLG','cf4dbdefe541083e06d71f5ba7ad9aaa',NULL,1,'2015-03-02 07:52:13','2015-03-02 07:52:13'),(15,'test13','test13@gmail.com','$2y$10$cbggPZGfgMH/rReZl9lEtOFQTyyitSOmKQZFDWxuYbybp8eavawA.','9af5c8dd96f44da743fc4d7c3541129d',NULL,1,'2015-03-02 08:00:41','2015-03-02 08:00:41'),(16,'test14','test14@gmail.com','$2y$10$kBiAWfJj0DBaLef2055q2OElXWJ/.f0wbxhutuAS58qmsxWDcX.k2','54ee3fa65e1a7a1521cfe06514a82e23',NULL,1,'2015-03-02 08:07:15','2015-03-02 08:07:15'),(17,'test15','test15@gmail.com','$2y$10$E/vFmwA.ql4tw8fvFwqQIePrQdDHrC08QKrODRRWaDqR5CJ0YM0Wq','30f09ecbad61a9978a5a839d5d71061f',NULL,1,'2015-03-02 08:07:27','2015-03-02 08:07:27'),(18,'test18','test18@gmail.com','$2y$10$CwzsMrKvzlS1uzZgp09GwuShipOOEQUvZVlyBnshLDFriYmYTYNFW','e19fcd6de35c5e9ae249385ae7012b6f',NULL,1,'2015-03-02 08:19:16','2015-03-02 08:19:16'),(19,'test19','test19@gmail.com','$2y$10$BuwHLdf8T9CaO2Q1pTrdju83.nnG9aehii0QvKjiyK10W5AASXl2y','95c040ee2baa75e310fe8e29d966ffbb',NULL,1,'2015-03-02 08:37:16','2015-03-02 08:37:16'),(20,'test20','test20@gmail.com','$2y$10$v0E/cWTs.oC5HyxPXll2RuA5ivbRj5FaX2S0MxBPXVBBPf//o0Sha','961f07e76cf6a507f8c995f78a8f62d3','zm7W3RHcMdkBux05UC9ENo0aPcWzt95VDUb2ZRUhHnZymHxjmWB3oTSXi3ox',1,'2015-03-02 09:18:09','2015-03-06 09:06:44'),(21,'john dow','test30@gmail.com','$2y$10$Fh2FlfZ3KaZC1dChouU19uoAdNlGZ86hQi3C8KLC6/EOADJDV7aWe','7d6481d015040b73cb32c8ae0c6f8b3a',NULL,0,'2015-03-06 08:35:16','2015-03-06 08:35:16'),(22,'dave mason','test31@gmail.com','$2y$10$3mW8cC4OO5x3DVEUxXoXp.3ZC4sNZv19YK1zI1RHXpoDn.0cqEgdO','de9ac36bd0c353875fa8c78ee281f3f1',NULL,0,'2015-03-06 08:48:27','2015-03-06 08:48:27'),(26,'peter','kangchin02@gmail.com','$2y$10$SQqusRzKwhlCQ1Vh9p0wpOaIfxp9IIo4nHmzsJhkg7jydPcDBaVUy','7d00957e08c2ba32837781795bb77caa',NULL,0,'2015-03-06 22:09:34','2015-03-06 22:09:34'),(27,'dfsfdf','te1@gmail.com','$2y$10$ShNrbvspnR6op4z8bNlCYOfcgWD5yfxNQx7nhRgluowqO3ocAutqC','724c4a3d2330d820e7ffba99668fe93c',NULL,0,'2015-03-06 22:35:00','2015-03-06 22:35:00'),(28,'opentuta','pchin03@gmail.com','$2y$10$dxw.qQ.Z3vbe30N4cnK8sOciprmILpElJuBkYtyt/bqWg2HInrAb.','fac2a814bfea2fcfbd43de1d911b6308',NULL,0,'2015-03-06 22:46:02','2015-03-06 22:46:02');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-03-08 11:14:09
