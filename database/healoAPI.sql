-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 05, 2022 at 06:24 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `healoAPI`
--

-- --------------------------------------------------------

--
-- Table structure for table `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `user_is_available` tinyint(1) NOT NULL DEFAULT 1,
  `user_gender` varchar(2) DEFAULT NULL,
  `user_year_born` int(11) DEFAULT NULL,
  `user_goal` varchar(50) DEFAULT NULL,
  `user_avail_hour` varchar(50) DEFAULT NULL,
  `user_desc` varchar(50) DEFAULT NULL,
  `user_profile_pict` varchar(50) DEFAULT NULL,
  `is_accept_agreement` tinyint(1) DEFAULT NULL,
  `agreement_time` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `role_id`, `user_name`, `user_email`, `password`, `user_is_available`, `user_gender`, `user_year_born`, `user_goal`, `user_avail_hour`, `user_desc`, `user_profile_pict`, `is_accept_agreement`, `agreement_time`, `createdAt`, `updatedAt`) VALUES
(11, 1, 'ian', 'ian@mail.com', '$2a$08$gEYxknjL4VJV/gN64Wzdmud1XJQfpaEGhwg5WH6Yv.vdN5dt2BtHK', 1, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2022-09-27 01:00:00', '2022-10-03 15:02:35', '2022-10-03 15:02:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
