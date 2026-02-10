# Dijkhuis App Online

Een web app die **urenregistraties ophaalt uit de database** en een **PDF-urenbriefje genereert**.
Deze website is **niet bedoeld om gekopieerd, extern gedraaid of ergens anders gehost te worden**.

## Belangrijk

* De applicatie werkt **alleen binnen de bedoelde bedrijfsomgeving**
* Het is **niet toegestaan** om deze software buiten dit project te gebruiken of opnieuw te deployen
* Inloggen moet gebeuren met een **admin account**
* Zonder admin login kan de website **niet gebruikt worden**

## Routes

| Route      | Functie                                                     |
| ---------- | ----------------------------------------------------------- |
| `/` | Weeknummer moet **handmatig worden gekozen** in de website  |
| `/:week`   | Weeknummer staat **vooraf al ingevuld** (via URL parameter) |

## Gebruik

Nadat er is ingelogd, kan er een weeknummer (mogelijk al vooraf ingesteld) worden geselecteerd. Dit zijn de laatste **100 weeknummers**. Na selectie wordt er een PDF gegenereerd wanneer **PDF maken** wordt geselecteerd.

## URL

De URL van de Web App, is hieronder te vinden

**[Dijkhuis App Online](https://gadijkhuis.github.io/DijkhuisAppOnline/)**