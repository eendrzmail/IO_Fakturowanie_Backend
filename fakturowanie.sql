-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 13 Sty 2021, 13:10
-- Wersja serwera: 10.4.16-MariaDB
-- Wersja PHP: 7.4.12

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `fakturowanie`
--
CREATE DATABASE IF NOT EXISTS `heroku_d6d6ab2d50fa0a4` DEFAULT CHARACTER SET utf8 COLLATE utf8_polish_ci;
USE `heroku_d6d6ab2d50fa0a4`;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `faktury`
--

DROP TABLE IF EXISTS `faktury`;
CREATE TABLE IF NOT EXISTS `faktury` (
  `id_faktura` int(11) NOT NULL AUTO_INCREMENT,
  `id_kupujacy` int(11) DEFAULT NULL,
  `id_sprzedajacy` int(11) DEFAULT NULL,
  `nr_faktury` varchar(255) DEFAULT NULL,
  `data_wystawienia` date DEFAULT NULL,
  `data_sprzedazy` date DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `forma_platnosci` varchar(255) DEFAULT NULL,
  `data_platnosci` date DEFAULT NULL,
  PRIMARY KEY (`id_faktura`),
  KEY `id_kupujacy` (`id_kupujacy`),
  KEY `id_sprzedajacy` (`id_sprzedajacy`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `faktury`
--

INSERT INTO `faktury` (`id_faktura`, `id_kupujacy`, `id_sprzedajacy`, `nr_faktury`, `data_wystawienia`, `data_sprzedazy`, `status`, `forma_platnosci`, `data_platnosci`) VALUES
(1, 2, 1, '1001', '2020-11-27', '2020-11-26', 'Wystawiona', 'karta', '2020-11-26'),
(56, 10, 1, '202012145863', '2020-12-14', '2020-12-13', 'Wystawiona', 'undefined', '0000-00-00'),
(57, 10, 1, '202012132412', '2020-12-13', '2020-12-13', 'Wystawiona', 'gotówka', '2020-12-13'),
(58, 21, 1, '202012141282', '2020-12-14', '2020-12-14', 'Wystawiona', 'karta', '2020-12-14'),
(59, 21, 1, '202012145235', '2020-12-03', '2020-12-14', 'Wystawiona', 'gotówka', '2020-12-14'),
(60, 21, 1, '202012142000', '2020-12-14', '2020-12-14', 'Edytowalna', 'undefined', '0000-00-00'),
(61, 21, 1, '20201214243', '2020-12-14', '2020-12-14', 'Edytowalna', 'gotówka', '2020-12-14'),
(62, 22, 1, '202012155268', '2020-12-15', '2020-12-15', 'Edytowalna', 'gotówka', '2020-12-15');

-- --------------------------------------------------------

--
-- Zastąpiona struktura widoku `fakturyponip`
-- (Zobacz poniżej rzeczywisty widok)
--
DROP VIEW IF EXISTS `fakturyponip`;
CREATE TABLE IF NOT EXISTS `fakturyponip` (
`id_faktura` int(11)
,`id_kupujacy` int(11)
,`id_sprzedajacy` int(11)
,`nr_faktury` varchar(255)
,`data_wystawienia` date
,`data_sprzedazy` date
,`status` varchar(255)
,`forma_platnosci` varchar(255)
,`data_platnosci` date
,`id_kontrahent` int(11)
,`nazwa` varchar(255)
,`adres` varchar(255)
,`NIP` varchar(20)
);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `kontrahenci`
--

DROP TABLE IF EXISTS `kontrahenci`;
CREATE TABLE IF NOT EXISTS `kontrahenci` (
  `id_kontrahent` int(11) NOT NULL AUTO_INCREMENT,
  `nazwa` varchar(255) DEFAULT NULL,
  `adres` varchar(255) DEFAULT NULL,
  `NIP` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_kontrahent`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `kontrahenci`
--

INSERT INTO `kontrahenci` (`id_kontrahent`, `nazwa`, `adres`, `NIP`) VALUES
(1, 'Naszaf Firma', 'Rzeszów 123a', '0000000001'),
(2, 'Lokalna firma 1', 'Rzeszów2', '1070003463'),
(3, 'Lokalna firma 2', 'Krosno', '1221348653'),
(10, 'Beatty, Fisher and Goodwin', 'adres 5', '1234567895'),
(21, 'Abernathy LLC', 'adres 7', '1234567897'),
(22, 'Durgan, Legros and Barton', 'adres 8', '1234567898');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `wiersze_faktury`
--

DROP TABLE IF EXISTS `wiersze_faktury`;
CREATE TABLE IF NOT EXISTS `wiersze_faktury` (
  `id_wiersz` int(11) NOT NULL AUTO_INCREMENT,
  `id_faktury` int(11) DEFAULT NULL,
  `nazwa` varchar(255) DEFAULT NULL,
  `jednostka` varchar(255) DEFAULT NULL,
  `ilosc` decimal(6,2) DEFAULT NULL,
  `cena_netto` decimal(6,2) DEFAULT NULL,
  `vat` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_wiersz`),
  KEY `id_faktury` (`id_faktury`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `wiersze_faktury`
--

INSERT INTO `wiersze_faktury` (`id_wiersz`, `id_faktury`, `nazwa`, `jednostka`, `ilosc`, `cena_netto`, `vat`) VALUES
(1, 1, 'Ziemniaki', 'Kg', '10.62', '0.80', 23),
(2, 1, 'Pomidory', 'Kg', '10.62', '0.80', 23),
(60, 56, 'Tuna', 'szt', '1.00', '232.21', 55),
(61, 56, 'Car', 'szt', '1.00', '615.32', 18),
(68, 59, 'Salad', 'szt', '1.00', '754.79', 74),
(69, 59, 'Salad', 'szt', '1.00', '754.79', 74),
(90, 57, 'Tuna', 'szt', '1.00', '232.21', 55),
(91, 57, 'Ball', 'szt', '1.00', '273.37', 8),
(92, 57, 'Keyboard', 'szt', '1.00', '696.01', 54),
(93, 57, 'Car', 'szt', '1.00', '615.32', 18),
(94, 60, 'Keyboard', 'szt', '2.00', '696.01', 54),
(95, 60, 'Salad', 'szt', '1.00', '754.79', 74),
(96, 60, 'Car', 'szt', '1.00', '987.72', 59),
(103, 58, 'Car', 'szt', '1.00', '897.36', 63),
(104, 58, 'Salad', 'szt', '1.00', '754.79', 74),
(105, 58, 'Ball', 'szt', '1.00', '523.76', 10),
(106, 58, 'Keyboard', 'szt', '1.00', '696.01', 54),
(107, 58, 'Shoes', 'szt', '1.00', '134.39', 75),
(108, 61, 'Ball', 'szt', '1.00', '523.76', 10),
(109, 61, 'Keyboard', 'szt', '1.00', '623.07', 85),
(110, 62, 'Chair', 'szt', '2.00', '15.60', 13),
(111, 62, 'Keyboard', 'szt', '1.00', '248.01', 78),
(112, 62, 'Keyboard', 'szt', '1.00', '623.07', 85);

-- --------------------------------------------------------

--
-- Struktura widoku `fakturyponip`
--
DROP TABLE IF EXISTS `fakturyponip`;

DROP VIEW IF EXISTS `fakturyponip`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `fakturyponip`  AS SELECT `faktury`.`id_faktura` AS `id_faktura`, `faktury`.`id_kupujacy` AS `id_kupujacy`, `faktury`.`id_sprzedajacy` AS `id_sprzedajacy`, `faktury`.`nr_faktury` AS `nr_faktury`, `faktury`.`data_wystawienia` AS `data_wystawienia`, `faktury`.`data_sprzedazy` AS `data_sprzedazy`, `faktury`.`status` AS `status`, `faktury`.`forma_platnosci` AS `forma_platnosci`, `faktury`.`data_platnosci` AS `data_platnosci`, `kontrahenci`.`id_kontrahent` AS `id_kontrahent`, `kontrahenci`.`nazwa` AS `nazwa`, `kontrahenci`.`adres` AS `adres`, `kontrahenci`.`NIP` AS `NIP` FROM (`faktury` join `kontrahenci`) WHERE `faktury`.`id_kupujacy` = `kontrahenci`.`id_kontrahent` ;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `faktury`
--
ALTER TABLE `faktury`
  ADD CONSTRAINT `faktury_ibfk_1` FOREIGN KEY (`id_kupujacy`) REFERENCES `kontrahenci` (`id_kontrahent`),
  ADD CONSTRAINT `faktury_ibfk_2` FOREIGN KEY (`id_sprzedajacy`) REFERENCES `kontrahenci` (`id_kontrahent`);

--
-- Ograniczenia dla tabeli `wiersze_faktury`
--
ALTER TABLE `wiersze_faktury`
  ADD CONSTRAINT `wiersze_faktury_ibfk_1` FOREIGN KEY (`id_faktury`) REFERENCES `faktury` (`id_faktura`);
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
