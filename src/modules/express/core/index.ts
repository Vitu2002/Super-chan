import RedirectLinks from "../../../database/models/RedirectLinks";
import { connect } from "mongoose";
import { config } from "dotenv";
import express from "express";

config();
const app = express();
connect(`${process.env.MONGO_URI}`).then(() => { console.log("Database ligada com sucesso!") });

app.use(express.json());


app.get('/:link', async (req, res) => {
    const route = req.params.link

    if (!route || route.length === 0) return res.redirect("https://superscans.site");

    const link = await RedirectLinks.findOne({ from: route });

    if (!link) return res.json({ error: 404, message: "URL Inválida." }); //res.redirect("https://superscans.site");

    await link.update({ uses: link.uses + 1 });

    return res.redirect(link.to);
})

app.listen(3000)