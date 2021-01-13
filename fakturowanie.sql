CREATE DATABASE  IF NOT EXISTS `fakturowanie` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `fakturowanie`;
-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: fakturowanie
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `faktury`
--

DROP TABLE IF EXISTS `faktury`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faktury` (
  `id_faktura` int NOT NULL AUTO_INCREMENT,
  `id_kupujacy` int DEFAULT NULL,
  `id_sprzedajacy` int DEFAULT NULL,
  `nr_faktury` varchar(255) DEFAULT NULL,
  `data_wystawienia` date DEFAULT NULL,
  `data_sprzedazy` date DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `forma_platnosci` varchar(255) DEFAULT NULL,
  `data_platnosci` date DEFAULT NULL,
  PRIMARY KEY (`id_faktura`),
  KEY `id_kupujacy` (`id_kupujacy`),
  KEY `id_sprzedajacy` (`id_sprzedajacy`),
  CONSTRAINT `faktury_ibfk_1` FOREIGN KEY (`id_kupujacy`) REFERENCES `kontrahenci` (`id_kontrahent`),
  CONSTRAINT `faktury_ibfk_2` FOREIGN KEY (`id_sprzedajacy`) REFERENCES `kontrahenci` (`id_kontrahent`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faktury`
--

LOCK TABLES `faktury` WRITE;
/*!40000 ALTER TABLE `faktury` DISABLE KEYS */;
INSERT INTO `faktury` VALUES (1,2,1,'1001','2020-11-27','2020-11-26','done','karta','2020-11-26'),(2,3,1,'1002','2020-11-27','2020-11-25','done','gotowka','2020-11-26'),(3,2,1,'1003','2020-11-27','2020-11-12','done','gotowka','2020-11-12'),(42,2,1,'2020-11-30/31','2020-11-30','2020-11-30','done','karta','2020-11-30'),(43,2,1,'2020-11-30/20','2020-11-30','2020-11-30','done','karta','2020-11-30');
/*!40000 ALTER TABLE `faktury` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kontrahenci`
--

DROP TABLE IF EXISTS `kontrahenci`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kontrahenci` (
  `id_kontrahent` int NOT NULL AUTO_INCREMENT,
  `nazwa` varchar(255) DEFAULT NULL,
  `adres` varchar(255) DEFAULT NULL,
  `nip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_kontrahent`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kontrahenci`
--

LOCK TABLES `kontrahenci` WRITE;
/*!40000 ALTER TABLE `kontrahenci` DISABLE KEYS */;
INSERT INTO `kontrahenci` VALUES (1,'Naszaf Firma','Rzeszów 123a','0000000001'),(2,'Lokalna firma 1','Rzeszów2','1070003463'),(3,'Lokalna firma 2','Krosno','1221348653'),(10,'Beatty, Fisher and Goodwin','adres 5','1234567895');
/*!40000 ALTER TABLE `kontrahenci` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wiersze_faktury`
--

DROP TABLE IF EXISTS `wiersze_faktury`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wiersze_faktury` (
  `id_wiersz` int NOT NULL AUTO_INCREMENT,
  `id_faktury` int DEFAULT NULL,
  `nazwa` varchar(255) DEFAULT NULL,
  `jednostka` varchar(255) DEFAULT NULL,
  `ilosc` decimal(6,2) DEFAULT NULL,
  `cena_netto` decimal(6,2) DEFAULT NULL,
  `vat` int DEFAULT NULL,
  PRIMARY KEY (`id_wiersz`),
  KEY `id_faktury` (`id_faktury`),
  CONSTRAINT `wiersze_faktury_ibfk_1` FOREIGN KEY (`id_faktury`) REFERENCES `faktury` (`id_faktura`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wiersze_faktury`
--

LOCK TABLES `wiersze_faktury` WRITE;
/*!40000 ALTER TABLE `wiersze_faktury` DISABLE KEYS */;
INSERT INTO `wiersze_faktury` VALUES (1,1,'Ziemniaki','Kg',10.62,0.80,23),(2,1,'Pomidory','Kg',10.62,0.80,23),(41,42,'Keyboard','szt',1.00,248.01,78),(42,42,'Chair','szt',1.00,15.60,13),(43,42,'Tuna','szt',1.00,352.98,68),(44,43,'Ball','szt',1.00,273.37,8),(45,43,'Keyboard','szt',1.00,248.01,78);
/*!40000 ALTER TABLE `wiersze_faktury` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'fakturowanie'
--

--
-- Dumping routines for database 'fakturowanie'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-30 17:36:46
