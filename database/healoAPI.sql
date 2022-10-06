-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 06, 2022 at 06:40 AM
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
-- Table structure for table `assesment_questions`
--

CREATE TABLE `assesment_questions` (
  `question_id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `question` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `assesment_question_answers`
--

CREATE TABLE `assesment_question_answers` (
  `answer_id` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `answer` varchar(255) DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `updatedAt` datetime NOT NULL,
  `is_email_validated` tinyint(1) DEFAULT 0,
  `email_validation_key` int(5) DEFAULT NULL,
  `email_validation_valid_until` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `role_id`, `user_name`, `user_email`, `password`, `user_is_available`, `user_gender`, `user_year_born`, `user_goal`, `user_avail_hour`, `user_desc`, `user_profile_pict`, `is_accept_agreement`, `agreement_time`, `createdAt`, `updatedAt`, `is_email_validated`, `email_validation_key`, `email_validation_valid_until`) VALUES
(14, 1, 'rahmat_afriyanton', 'rahmatafriyanton@mail.com', '$2a$08$xjPB3paYUNTgEJ1BSF0F7.r.GLGLl5phkDGpcL5CYBiSWtREKfJKe', 1, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2022-09-27 01:00:00', '2022-10-05 12:17:42', '2022-10-05 18:01:50', 1, 8424, '2022-10-05 12:22:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assesment_questions`
--
ALTER TABLE `assesment_questions`
  ADD PRIMARY KEY (`question_id`);

--
-- Indexes for table `assesment_question_answers`
--
ALTER TABLE `assesment_question_answers`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `question_id` (`question_id`);

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
-- AUTO_INCREMENT for table `assesment_questions`
--
ALTER TABLE `assesment_questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assesment_question_answers`
--
ALTER TABLE `assesment_question_answers`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assesment_question_answers`
--
ALTER TABLE `assesment_question_answers`
  ADD CONSTRAINT `assesment_question_answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `assesment_questions` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
