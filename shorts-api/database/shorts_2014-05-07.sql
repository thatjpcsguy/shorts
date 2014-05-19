# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.5.33)
# Database: shorts
# Generation Time: 2014-05-07 01:27:27 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table learning
# ------------------------------------------------------------

DROP TABLE IF EXISTS `learning`;

CREATE TABLE `learning` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `date` varchar(255) NOT NULL DEFAULT '',
  `max_temp` int(11) NOT NULL,
  `min_temp` int(11) NOT NULL,
  `mean_temp` int(11) NOT NULL,
  `max_humidity` int(11) NOT NULL,
  `min_humidity` int(11) NOT NULL,
  `mean_humidity` int(11) NOT NULL,
  `max_wind` int(11) NOT NULL,
  `mean_wind` int(11) NOT NULL,
  `precipitation` int(11) NOT NULL,
  `cloud_cover` int(11) NOT NULL,
  `events` varchar(255) DEFAULT NULL,
  `class` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
