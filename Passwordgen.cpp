#include <iostream>
#include <random>
#include <string>

int main() {
  // Länge des Passworts festlegen
  int passwordLength = 10;

  // Mögliche Zeichen für das Passwort definieren
  std::string possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Zufallsgenerator initialisieren
  std::random_device rd;
  std::mt19937 rng(rd());
  std::uniform_int_distribution<int> uni(0, possibleCharacters.length() - 1);

  // Passwort generieren
  std::string password;
  for (int i = 0; i < passwordLength; i++) {
    char c = possibleCharacters[uni(rng)];
    password += c;
  }

  // Passwort ausgeben
  std::cout << password << std::endl;

  return 0;
}
