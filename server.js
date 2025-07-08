const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// ➤ Dossier contenant les fichiers statiques (CSS, images, JS)
app.use(express.static("style"));

// ➤ Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

// ➤ Schéma Mongoose pour formulaire de contact
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
});
const Contact = mongoose.model("Contact", contactSchema);

// ➤ Route GET : afficher le fichier index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// ➤ Route POST : soumission du formulaire
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).send("Tous les champs sont requis.");
  }
  if (!email.includes("@")) {
    return res.status(400).send("Adresse email invalide.");
  }

  try {
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();
    res.redirect("/");
  } catch (err) {
    console.error("❌ Erreur lors de l'enregistrement :", err);
    res.status(500).send("Erreur serveur.");
  }
});

const PORT = process.env.PORT || 4700;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
