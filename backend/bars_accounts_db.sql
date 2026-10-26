-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 07, 2026 at 12:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bars_accounts_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bars`
--

CREATE TABLE `bars` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bars`
--

INSERT INTO `bars` (`id`, `name`) VALUES
(1, 'VENKATESWARA WINES ONGOLE'),
(4, 'Surya Bar & Restaurant');

-- --------------------------------------------------------

--
-- Table structure for table `bar_brands`
--

CREATE TABLE `bar_brands` (
  `bar_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bar_brands`
--

INSERT INTO `bar_brands` (`bar_id`, `brand_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(1, 25),
(1, 26),
(1, 27),
(1, 28),
(1, 29),
(1, 30),
(1, 31),
(1, 32),
(1, 33),
(1, 34),
(1, 35),
(1, 36),
(1, 37),
(1, 38),
(1, 39),
(1, 40),
(1, 41),
(1, 42),
(1, 43),
(1, 44),
(1, 45),
(1, 46),
(1, 47),
(1, 48),
(1, 49),
(1, 50),
(1, 51),
(1, 52),
(1, 53),
(1, 54),
(1, 55),
(1, 56),
(1, 57),
(1, 58),
(1, 59),
(1, 60),
(1, 61),
(1, 62),
(1, 63),
(1, 64),
(1, 65),
(1, 66),
(1, 67),
(1, 68),
(1, 69),
(1, 70),
(1, 71),
(1, 72),
(1, 73),
(1, 74),
(1, 75),
(1, 76),
(1, 77),
(1, 78),
(1, 79),
(1, 80),
(1, 81),
(1, 82),
(1, 83),
(1, 84),
(1, 85),
(1, 86),
(1, 87),
(1, 88),
(1, 89),
(1, 90),
(1, 91),
(1, 92),
(1, 93),
(1, 94),
(1, 95),
(1, 96),
(1, 97),
(1, 98),
(1, 99),
(1, 100),
(1, 101),
(1, 102),
(1, 103),
(1, 104),
(1, 105),
(1, 106),
(1, 107),
(1, 108),
(1, 109),
(1, 110),
(1, 111),
(1, 112),
(1, 113),
(1, 114),
(1, 115),
(1, 116),
(1, 117),
(1, 118),
(1, 119),
(1, 120),
(1, 121),
(1, 122),
(1, 123),
(1, 124),
(1, 125),
(1, 126),
(1, 127),
(1, 128),
(1, 129),
(1, 130),
(1, 131),
(1, 132),
(1, 133),
(1, 134),
(1, 135),
(1, 136),
(1, 137),
(1, 138),
(1, 139),
(1, 140),
(1, 141),
(1, 142),
(1, 143),
(1, 144),
(1, 145),
(1, 146),
(1, 147),
(1, 148),
(1, 150),
(1, 151),
(1, 152),
(1, 153),
(1, 154),
(1, 155),
(1, 156),
(1, 157),
(1, 158),
(1, 159),
(1, 160),
(1, 161),
(1, 162),
(1, 163),
(1, 164),
(1, 165),
(1, 166),
(1, 167),
(1, 168),
(1, 169),
(1, 170),
(1, 171),
(1, 172),
(1, 173),
(1, 174),
(1, 175),
(1, 176),
(1, 177),
(1, 178),
(1, 179),
(1, 180),
(1, 181),
(1, 182),
(1, 183),
(1, 184),
(1, 185),
(1, 186),
(1, 187),
(1, 188),
(1, 189),
(1, 190),
(1, 191),
(1, 192),
(1, 193),
(1, 194),
(1, 195),
(1, 196),
(1, 197),
(1, 198),
(1, 199),
(1, 200),
(1, 201),
(1, 202),
(1, 203),
(1, 204),
(1, 205),
(1, 206),
(1, 207),
(1, 208),
(1, 209),
(1, 210),
(1, 211),
(1, 212),
(1, 213),
(1, 214),
(1, 215),
(1, 216),
(1, 217),
(1, 218),
(1, 219),
(1, 220),
(1, 221),
(1, 222),
(1, 223),
(1, 224),
(1, 225),
(1, 226),
(1, 227),
(1, 228),
(1, 229),
(1, 230),
(1, 231),
(1, 232),
(1, 233),
(1, 507),
(1, 683),
(1, 742),
(1, 4097),
(1, 4108),
(1, 4507),
(1, 4702),
(1, 5291),
(1, 6136),
(1, 6138),
(4, 74),
(4, 75),
(4, 150),
(4, 167),
(4, 168),
(4, 203),
(4, 6138);

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `category` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sale_mrp` decimal(10,2) DEFAULT 0.00,
  `ind_value` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `category`, `name`, `sale_mrp`, `ind_value`) VALUES
(1, 'BRANDIES', 'MHB-Q', 780.00, 671.04),
(2, 'BRANDIES', 'MHB-P', 410.00, 347.59),
(3, 'BRANDIES', 'MHB-N', 210.00, 173.24),
(4, 'BRANDIES', 'MHB-90 ml', 120.00, 96.38),
(5, 'BRANDIES', 'MH ORANGE-Q', 840.00, 720.81),
(6, 'BRANDIES', 'MH ORANGE-P', 440.00, 0.00),
(7, 'BRANDIES', 'MH ORANGE-N', 230.00, 191.54),
(8, 'BRANDIES', 'MC BRANDY-Q', 700.00, 601.21),
(9, 'BRANDIES', 'MC BRANDY-P', 360.00, 601.21),
(10, 'BRANDIES', 'MC BRANDY-N', 190.00, 0.00),
(11, 'BRANDIES', 'MC BRANDY-D', 110.00, 0.00),
(12, 'BRANDIES', 'CNB GREEN-Q', 1190.00, 1025.11),
(13, 'BRANDIES', 'CNB GREEN-P', 610.00, 0.00),
(14, 'BRANDIES', 'CNB GREEN-N', 320.00, 269.29),
(15, 'BRANDIES', 'CNB RED-Q', 900.00, 807.31),
(16, 'BRANDIES', 'CNB RED-P', 460.00, 407.60),
(17, 'BRANDIES', 'CNB RED-N', 240.00, 208.16),
(18, 'BRANDIES', 'OAB-Q', 490.00, 413.95),
(19, 'BRANDIES', 'OAB-N', 140.00, 112.76),
(20, 'BRANDIES', 'MORPHEOUS-Q', 1080.00, 929.48),
(21, 'BRANDIES', 'MORPHEOUS-P', 560.00, 477.77),
(22, 'BRANDIES', 'MORPHEOUS-N', 310.00, 261.53),
(23, 'BRANDIES', 'MORPHEOUS BLUE-Q', 1350.00, 1152.56),
(24, 'BRANDIES', 'MORPHEOUS BLUE-N', 360.00, 301.53),
(25, 'BRANDIES', 'KYRON-Q', 1080.00, 0.00),
(26, 'BRANDIES', 'KYRON-P', 550.00, 0.00),
(27, 'BRANDIES', 'KYRON-N', 310.00, 269.31),
(28, 'BRANDIES', 'OC BRANDY-N', 140.00, 0.00),
(29, 'BRANDIES', 'WHYTE HALL-Q', 600.00, 512.37),
(30, 'BRANDIES', 'WHYTE HALL-N', 170.00, 512.37),
(31, 'BRANDIES', 'BOLS-Q', 1190.00, 1025.66),
(32, 'BRANDIES', 'BOLS-N', 320.00, 269.22),
(33, 'BRANDIES', 'HOBSON-Q', 2400.00, 0.00),
(34, 'BRANDIES', 'HOBSON-N', 640.00, 0.00),
(35, 'BRANDIES', 'BLACK & GOLD -Q', 730.00, 0.00),
(36, 'BRANDIES', 'BLACK & GOLD -N', 200.00, 0.00),
(37, 'BRANDIES', 'MC VSOP-Q', 730.00, 0.00),
(38, 'BRANDIES', 'MC VSOP-P', 380.00, 0.00),
(39, 'BRANDIES', 'MC VSOP-N', 200.00, 0.00),
(40, 'BRANDIES', 'MC VSOP-D', 110.00, 0.00),
(41, 'BRANDIES', 'OCEAN BLUE-D', 80.00, 0.00),
(42, 'BRANDIES', 'AC BLACK-Q', 0.00, 0.00),
(43, 'BRANDIES', 'AC BLACK-N', 170.00, 0.00),
(44, 'BRANDIES', 'MC WHISKY-Q', 730.00, 627.12),
(45, 'BRANDIES', 'MC WHISKY-P', 380.00, 320.84),
(46, 'BRANDIES', 'MC WHISKY-N', 200.00, 164.76),
(47, 'BRANDIES', 'MC WHISKY-D', 110.00, 0.00),
(48, 'BRANDIES', 'RC WHISKY-Q', 850.00, 807.84),
(49, 'BRANDIES', 'RC WHISKY-P', 440.00, 407.83),
(50, 'BRANDIES', 'RC WHISKY-N', 230.00, 190.73),
(51, 'BRANDIES', 'RC 90 ml', 130.00, 0.00),
(52, 'BRANDIES', 'ROYAL STAG-Q', 860.00, 0.00),
(53, 'BRANDIES', 'ROYAL STAG-P', 440.00, 372.92),
(54, 'BRANDIES', 'ROYAL STAG-N', 230.00, 190.73),
(55, 'BRANDIES', 'ROYAL STAG-D', 130.00, 0.00),
(56, 'BRANDIES', 'OC WHISKY-Q', 560.00, 501.86),
(57, 'BRANDIES', 'OC WHISKY-P', 290.00, 501.86),
(58, 'BRANDIES', 'OC WHISKY-N', 160.00, 139.06),
(59, 'BRANDIES', 'OC WHISKY-D', 90.00, 139.06),
(60, 'BRANDIES', 'IB-Q', 730.00, 627.12),
(61, 'BRANDIES', 'IB-P', 380.00, 320.84),
(62, 'BRANDIES', 'IB-N', 200.00, 164.75),
(63, 'BRANDIES', 'IB-D', 110.00, 87.00),
(64, 'BRANDIES', 'AC PREMIUM-Q', 730.00, 627.12),
(65, 'BRANDIES', 'AC PREMIUM-N', 200.00, 164.76),
(66, 'BRANDIES', 'HYD BLUE - N', 170.00, 0.00),
(67, 'BRANDIES', 'HYD BLUE 90 ml', 90.00, 69.55),
(68, 'BRANDIES', 'B P - Q', 1340.00, 1144.34),
(69, 'BRANDIES', 'B P - P', 680.00, 0.00),
(70, 'BRANDIES', 'B P - N', 360.00, 302.14),
(71, 'BRANDIES', 'ANTIQUITY BLUE-Q', 1420.00, 319.14),
(72, 'BRANDIES', 'ANTIQUITY BLUE-P', 720.00, 319.14),
(73, 'BRANDIES', 'ANTIQUITY BLUE-N', 380.00, 319.14),
(74, 'BRANDIES', '100 PIPERS-Q', 2510.00, 2164.22),
(75, 'BRANDIES', '100 PIPERS-N', 690.00, 587.94),
(76, 'BRANDIES', 'SIGNATURE-Q', 1330.00, 1134.95),
(77, 'BRANDIES', 'SIGNATURE-P', 680.00, 576.45),
(78, 'BRANDIES', 'SIGNATURE-N', 360.00, 302.18),
(79, 'BRANDIES', 'BLACK DOG-Q', 2560.00, 2207.05),
(80, 'BRANDIES', 'BLACK DOG-N', 680.00, 579.01),
(81, 'BRANDIES', 'TEACHERS -Q', 2440.00, 2093.86),
(82, 'BRANDIES', 'TEACHERS -N', 720.00, 0.00),
(83, 'BRANDIES', 'TEACHERS -50-Q', 3620.00, 613.90),
(84, 'BRANDIES', 'VAT 69-Q', 2220.00, 1904.16),
(85, 'BRANDIES', 'VAT 69-N', 600.00, 1904.16),
(86, 'BRANDIES', '8PM GOLD-Q', 580.00, 112.76),
(87, 'BRANDIES', '8PM GOLD-N', 170.00, 112.76),
(88, 'BRANDIES', 'BLACK & WHITE - Q', 2410.00, 0.00),
(89, 'BRANDIES', 'BLACK & WHITE - P', 1240.00, 0.00),
(90, 'BRANDIES', 'BLACK & WHITE - N', 630.00, 0.00),
(91, 'BRANDIES', 'ICONIQ-Q', 730.00, 627.12),
(92, 'BRANDIES', 'ICONIQ-P', 380.00, 627.12),
(93, 'BRANDIES', 'ICONIQ-N', 200.00, 164.76),
(94, 'BRANDIES', 'BALLANTINE - Q', 2640.00, 2263.93),
(95, 'BRANDIES', 'JAMESON IRISH - Q', 2970.00, 2545.90),
(96, 'BRANDIES', 'WILLIAMSON - Q', 2200.00, 1886.64),
(97, 'BRANDIES', 'WILLIAMSON - N', 590.00, 1886.64),
(98, 'BRANDIES', 'CLASSIC BLUE 90 ML - D', 90.00, 0.00),
(99, 'BRANDIES', 'CLASSIC BLUE-N', 170.00, 138.64),
(100, 'BRANDIES', 'JW.RED LABEL-Q', 2760.00, 2367.66),
(101, 'BRANDIES', 'JW.BLACK LABEL-Q', 5050.00, 4342.95),
(102, 'BRANDIES', 'AFTER DARK-Q', 730.00, 627.11),
(103, 'BRANDIES', 'AFTER DARK-P', 380.00, 627.11),
(104, 'BRANDIES', 'AFTER DARK-N', 200.00, 164.75),
(105, 'BRANDIES', 'DEWARS-Q', 2450.00, 0.00),
(106, 'BRANDIES', 'KERALA CHEEP', 99.00, 85.78),
(107, 'BRANDIES', 'ALL SEASONS - Q', 820.00, 0.00),
(108, 'BRANDIES', 'ALL SEASONS - N', 220.00, 0.00),
(109, 'BRANDIES', 'J & B WHISKY', 2780.00, 0.00),
(110, 'BRANDIES', 'RAMTHAM BOLE-Q', 2510.00, 0.00),
(111, 'BRANDIES', 'RAMTHAM BOLE-P', 1270.00, 0.00),
(112, 'BRANDIES', 'RAMTHAM BOLE-N', 680.00, 0.00),
(113, 'BRANDIES', 'MALTAGE-Q', 1140.00, 0.00),
(114, 'BRANDIES', 'MC RUM-N', 160.00, 0.00),
(115, 'BRANDIES', 'BINNIES GRAPE BRANDY', 99.00, 0.00),
(116, 'BRANDIES', 'BACARDI  L RMU-Q', 1340.00, 1144.62),
(117, 'BRANDIES', 'BACARDI  L RMU-N', 360.00, 1144.62),
(118, 'BRANDIES', 'BREEZER', 130.00, 0.00),
(119, 'BRANDIES', 'BACARDI BREEZER', 150.00, 0.00),
(120, 'BRANDIES', 'BLACK BERRY', 130.00, 0.00),
(121, 'BRANDIES', 'MM ORANGE-Q', 900.00, 772.53),
(122, 'BRANDIES', 'MM ORANGE-N', 250.00, 209.26),
(123, 'BRANDIES', 'MM GREEN-Q', 900.00, 772.53),
(124, 'BRANDIES', 'MM GREEN-N', 250.00, 209.26),
(125, 'BRANDIES', 'ABSOLUTE  VODKA- Q', 2610.00, 2238.49),
(126, 'BRANDIES', 'SMIRNOFF-Q', 1190.00, 302.13),
(127, 'BRANDIES', 'SMIRNOFF-N', 310.00, 302.13),
(128, 'BRANDIES', 'MM GREEN-P', 460.00, 302.13),
(129, 'BRANDIES', 'MM ORANGE-P', 460.00, 302.13),
(130, 'BRANDIES', 'KYRA WINE-Q', 820.00, 302.13),
(131, 'BRANDIES', 'KYRA WINE-N', 200.00, 302.13),
(132, 'BRANDIES', 'ELITE-Q', 820.00, 190.37),
(133, 'BRANDIES', 'ELITE-N', 210.00, 190.37),
(134, 'BRANDIES', 'STOK S', 220.00, 190.37),
(135, 'BRANDIES', 'STOK C', 220.00, 190.37),
(136, 'BRANDIES', 'LEMPONT S', 180.00, 190.37),
(137, 'BRANDIES', 'KF-S', 200.00, 173.88),
(138, 'BRANDIES', 'KF-U', 220.00, 191.66),
(139, 'BRANDIES', 'KF -L', 180.00, 191.66),
(140, 'BRANDIES', 'KF STROM', 220.00, 156.43),
(141, 'BRANDIES', 'KARJURA', 180.00, 156.43),
(142, 'BRANDIES', 'BUDWISER -M', 300.00, 165.44),
(143, 'BRANDIES', 'BUDWISER TIN-M', 190.00, 165.44),
(144, 'BRANDIES', 'BUDWISER - P', 270.00, 261.19),
(145, 'BRANDIES', 'BUDWISER-  TIN - P', 180.00, 261.19),
(146, 'BRANDIES', 'CARLSBERG', 260.00, 156.43),
(147, 'BRANDIES', 'CARLSBERG.S', 0.00, 156.43),
(148, 'BRANDIES', 'KALYANI BLACK LABEL', 180.00, 156.43),
(150, 'BRANDIES', '10000 GOLD  STRONG BEER-750', 180.00, 199.28),
(151, 'BRANDIES', 'KIGFISHER ULTRA MAX -Q', 260.00, 199.28),
(152, 'BRANDIES', 'CLASSICO B -Q', 1280.00, 269.31),
(153, 'BRANDIES', 'AMERICAN PRIDE - Q', 1200.00, 0.00),
(154, 'BRANDIES', 'AMERICAN PRIDE - N', 330.00, 0.00),
(155, 'BRANDIES', 'CHIVAS REGAL - Q', 5270.00, 0.00),
(156, 'BRANDIES', 'MHB GREEN - Q', 830.00, 0.00),
(157, 'BRANDIES', 'MHB GREEN - N', 230.00, 0.00),
(158, 'BRANDIES', 'ROYAL PALACE-N', 230.00, 0.00),
(159, 'BRANDIES', 'OLD MUNKR-Q', 840.00, 0.00),
(160, 'BRANDIES', 'OLD CLUB BRANDY (N)', 130.00, 0.00),
(161, 'BRANDIES', 'OAKSMITH GOLD CLASSIC WHISKY-Q', 1610.00, 0.00),
(162, 'BRANDIES', 'OAKSMITH GOLD CLASSIC WHISKY-N', 430.00, 0.00),
(163, 'BRANDIES', 'ROYAL STAG BARREL-Q', 950.00, 0.00),
(164, 'BRANDIES', 'ROYAL STAG BARREL-N', 270.00, 0.00),
(165, 'BRANDIES', 'TWENTY ONE PLUS-Q', 1380.00, 69.55),
(166, 'BRANDIES', '8 PM RESERVED-Q', 730.00, 0.00),
(167, 'BRANDIES', '8 PM RESERVED-P', 380.00, 104.10),
(168, 'BRANDIES', '8 PM RESERVED -N', 200.00, 0.00),
(169, 'BRANDIES', 'JW.DOUBLE BLACK - Q', 6570.00, 0.00),
(170, 'BRANDIES', 'JOHNNIE WALKER BLONDE WHISKY-Q', 3820.00, 2102.89),
(171, 'BRANDIES', 'JIM BIM-Q', 3020.00, 587.94),
(172, 'BRANDIES', 'GRANTON - N', 180.00, 112.76),
(173, 'BRANDIES', 'BRITIES EMPAIR-Q', 730.00, 0.00),
(174, 'BRANDIES', 'BRITIES EMPAIR-N', 200.00, 0.00),
(175, 'BRANDIES', 'B7-Q', 730.00, 156.43),
(176, 'BRANDIES', 'B7-P', 380.00, 156.43),
(177, 'BRANDIES', 'B7-N', 200.00, 0.00),
(178, 'BRANDIES', 'B10-Q', 1250.00, 156.43),
(179, 'BRANDIES', 'B10-N', 340.00, 0.00),
(180, 'BRANDIES', 'LEGACY - Q', 1340.00, 139.06),
(181, 'BRANDIES', 'LEGACY - N', 360.00, 139.06),
(182, 'BRANDIES', 'BLACK DOG TRIPLE GOLD RESERCE - P', 1930.00, 0.00),
(183, 'BRANDIES', 'BLACK DOG TRIPLE GOLD RESERCE - N', 980.00, 0.00),
(184, 'BRANDIES', 'GOLDEN TOUCH-Q', 720.00, 0.00),
(185, 'BRANDIES', 'BLACK DOG-P', 1330.00, 579.01),
(186, 'BRANDIES', 'ICONIC-D', 110.00, 0.00),
(187, 'BRANDIES', 'BP-D (90ML)', 190.00, 0.00),
(188, 'BRANDIES', 'SILVER -90 ML', 90.00, 0.00),
(189, 'BRANDIES', 'ORIGINAL CHOICE-D', 80.00, 0.00),
(190, 'BRANDIES', 'MC VODKA Q', 1060.00, 0.00),
(191, 'BRANDIES', 'MC VODKA N', 280.00, 130.05),
(192, 'BRANDIES', 'MC PREMIUM DRY GIN 180 ml', 370.00, 0.00),
(193, 'BRANDIES', 'MC DOWELLS RUM-Q', 1060.00, 139.06),
(194, 'BRANDIES', 'MC DOWELLS RUM-N', 280.00, 139.06),
(195, 'BRANDIES', 'RUM (MC) - Q', 1330.00, 0.00),
(196, 'BRANDIES', 'RUM (MC) - N', 350.00, 0.00),
(197, 'BRANDIES', 'XXX RUM-Q', 850.00, 0.00),
(198, 'BRANDIES', 'XXX RUM-N', 240.00, 0.00),
(199, 'BRANDIES', 'M.M.PINK-Q', 1160.00, 0.00),
(200, 'BRANDIES', 'M.M.PINK-N', 310.00, 0.00),
(201, 'BRANDIES', 'M2  MAGIC MOMENT LEMON-Q', 1160.00, 0.00),
(202, 'BRANDIES', 'AB SOLUT CITRON-Q', 2690.00, 302.13),
(203, 'BRANDIES', '100 PIPERS-P', 1270.00, 587.94),
(204, 'BRANDIES', 'MRPS BLUE-P', 690.00, 0.00),
(205, 'BRANDIES', 'JACOBB-Q', 1980.00, 0.00),
(206, 'BRANDIES', 'MERCOT-Q', 1780.00, 0.00),
(207, 'BRANDIES', 'SHIRAJ-Q', 1600.00, 0.00),
(208, 'BRANDIES', 'SIDDUS WINE-Q', 630.00, 0.00),
(209, 'BRANDIES', 'ELITE-P', 420.00, 190.37),
(210, 'BRANDIES', 'BRETISH EMPIRE BEER', 200.00, 190.37),
(211, 'BRANDIES', 'HEINEKEN TIN -650ML', 270.00, 0.00),
(212, 'BRANDIES', 'HEINKIN--500 ML', 180.00, 0.00),
(213, 'BRANDIES', 'HEINKIN-330ML', 150.00, 156.43),
(214, 'BRANDIES', 'FOSTS-Q', 220.00, 156.43),
(215, 'BRANDIES', 'STERREN BEER-650ML', 200.00, 156.43),
(216, 'BRANDIES', 'HD-N', 130.00, 2102.89),
(217, 'BRANDIES', 'OLD ADMIRAL', 130.00, 2102.89),
(218, 'BRANDIES', 'FRENCH-Q', 780.00, 0.00),
(219, 'BRANDIES', 'FRENCH-P', 410.00, 0.00),
(220, 'BRANDIES', 'FRENCH-N', 210.00, 0.00),
(221, 'BRANDIES', 'MELISSA-N', 170.00, 0.00),
(222, 'BRANDIES', 'MELISSA-D', 90.00, 199.28),
(223, 'BRANDIES', 'ELITE CABERNET SHIRAZ RED WIN', 1770.00, 190.37),
(224, 'BRANDIES', 'MAGIC POINT GOLD', 150.00, 190.37),
(225, 'BRANDIES', 'RC -2 LITERS', 2220.00, 0.00),
(226, 'BRANDIES', 'REMY VSOP-Q', 3570.00, 0.00),
(227, 'BRANDIES', 'BTS 750', 200.00, 0.00),
(228, 'BRANDIES', 'OXB 90', 120.00, 191.66),
(229, 'BRANDIES', 'SRIGNATV B', 190.00, 191.66),
(230, 'BRANDIES', 'OC BRANDY-P', 260.00, 191.66),
(231, 'BRANDIES', 'OC BRANDY-Q', 490.00, 191.66),
(232, 'BRANDIES', 'T H C - P', 1300.00, 191.66),
(233, 'BRANDIES', 'MK -B 10000', 1010.00, 191.66),
(507, 'BRANDIES', 'B GOLD - D', 0.00, 0.00),
(683, 'BRANDIES', 'SIRI S SENTINI SPECIAL - N', 130.00, 156.43),
(742, 'BRANDIES', 'B GOLD -D', 0.00, 0.00),
(4097, 'BRANDIES', 'OT -D', 80.00, 164.75),
(4108, 'BRANDIES', 'B K P - N', 0.00, 0.00),
(4507, 'BRANDIES', 'MKFC N', 140.00, 0.00),
(4702, 'BRANDIES', 'OC BRANDY- D', 0.00, 191.66),
(5291, 'BRANDIES', 'DEWARS-N', 0.00, 0.00),
(6136, 'BRANDIES', 'BTS 650', 200.00, 0.00),
(6138, 'WHISKY', 'TEST BRAND', 1300.00, 330.00);

-- --------------------------------------------------------

--
-- Table structure for table `daily_stock`
--

CREATE TABLE `daily_stock` (
  `id` int(11) NOT NULL,
  `bar_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `brand_id` int(11) NOT NULL,
  `op_st` int(11) DEFAULT 0,
  `pr_st` int(11) DEFAULT 0,
  `total_st` int(11) DEFAULT 0,
  `cl_st` int(11) DEFAULT 0,
  `sl_st` int(11) DEFAULT 0,
  `sale_amount` decimal(12,2) DEFAULT 0.00,
  `cl_st_amount` decimal(12,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `token`) VALUES
(1, 'admin', 'admin123', 'a94a21408b94d3b0896f83b72a4555dd');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bars`
--
ALTER TABLE `bars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bar_brands`
--
ALTER TABLE `bar_brands`
  ADD PRIMARY KEY (`bar_id`,`brand_id`),
  ADD KEY `fk_bb_brand` (`brand_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `daily_stock`
--
ALTER TABLE `daily_stock`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_bar_date_brand` (`bar_id`,`date`,`brand_id`),
  ADD KEY `fk_daily_stock_brand` (`brand_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bars`
--
ALTER TABLE `bars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6139;

--
-- AUTO_INCREMENT for table `daily_stock`
--
ALTER TABLE `daily_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=965;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bar_brands`
--
ALTER TABLE `bar_brands`
  ADD CONSTRAINT `fk_bb_bar` FOREIGN KEY (`bar_id`) REFERENCES `bars` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bb_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `daily_stock`
--
ALTER TABLE `daily_stock`
  ADD CONSTRAINT `fk_daily_stock_bar` FOREIGN KEY (`bar_id`) REFERENCES `bars` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_daily_stock_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
