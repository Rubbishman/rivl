-- phpMyAdmin SQL Dump
-- version 3.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 02, 2012 at 09:46 PM
-- Server version: 5.5.25a
-- PHP Version: 5.4.4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

CREATE DATABASE IF NOT EXISTS `rivl`;

USE `rivl`;

--
-- Database: `vs`
--

-- --------------------------------------------------------

--
-- Table structure for table `competition`
--

CREATE TABLE IF NOT EXISTS `competition` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

--
-- Dumping data for table `competition`
--

INSERT INTO `competition` (`id`, `name`) VALUES
(1, 'Fooseball'),
(2, 'Table Tennis');

-- --------------------------------------------------------

--
-- Table structure for table `competitor`
--

CREATE TABLE IF NOT EXISTS `competitor` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

--
-- Dumping data for table `competitor`
--

INSERT INTO `competitor` (`name`) VALUES
('Dmitri'),
('Neil'),
('Nick'),
('Jonathan'),
('Liam'),
('Gerard'),
('Vlad'),
('Todd'),
('Patrick'),
('Darrin'),
('Elisabeth'),
('Ben'),
('Dean'),
('Rob'),
('Dan'),
('Andrew'),
('Paul'),
('Simon'),
('Kristo');

-- --------------------------------------------------------

--
-- Table structure for table `competitor_elo`
--

CREATE TABLE IF NOT EXISTS `competitor_elo` (
	`id` bigint NOT NULL AUTO_INCREMENT,
	`competitor_id` bigint NOT NULL,
	`competition_id` bigint NOT NULL,
	`elo` decimal (64,4) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

INSERT INTO `competitor_elo` (`competitor_id`,`competition_id`,`elo`) 
	SELECT competitor.id, competition.id, 1500 FROM `competitor` cross join `competition`;
-- --------------------------------------------------------

--
-- Table structure for table `detail`
--

CREATE TABLE IF NOT EXISTS `detail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `competition_id` bigint NOT NULL,
  `detail_set_id` bigint NOT NULL,
  `name` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

--
-- Dumping data for table `detail`
--

INSERT INTO `detail` (`id`, `competition_id`,`detail_set_id`, `name`) VALUES
(1, 1, 1, 'yellow'),
(2, 1, 1, 'blue');

-- --------------------------------------------------------

--
-- Table structure for table `game`
--

CREATE TABLE IF NOT EXISTS `game` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `competition_id` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `game_details`
--

CREATE TABLE IF NOT EXISTS `game_details` (
	`id` bigint NOT NULL AUTO_INCREMENT,
	`game_id` bigint NOT NULL,
	`competitor_id` bigint NOT NULL,
	`detail_id` bigint NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET= latin1;


-- --------------------------------------------------------

--
-- Table structure for table `score`
--

CREATE TABLE IF NOT EXISTS `score` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `game_id` bigint NOT NULL,
  `competitor_id` bigint NOT NULL,
  `rank` int NOT NULL,
  `score` int NOT NULL,
  `elo_before` decimal(64,4) NOT NULL,
  `elo_after` decimal(64,4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
