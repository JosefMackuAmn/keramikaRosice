class EmailTemplates {
    static newOrder({ variableSymbol, payment, delivery }) {
        let expedition = "Po uhrazení objednávky, dle přiložené faktury, vám bude zasláno zboží nejpozději do 5 dnů po obdržení platby.";
        if (payment === "DOB") expedition = "Zboží vám bude zasláno do 5 dnů.";
        if (delivery === "OOD") expedition = "Do 5 dnů vás kontaktujeme a domluvíme se na osobním předání.";

        return [
            `Keramika Rosice: Nová objednávka`,
            `<h2>Objednávka #${variableSymbol}</h2>
            <h3 style="font-size: 22px;">Keramika Rosice</h3><br/><br/>
            <p>Přijali jsme vaši objednávku a v příloze zasíláme fakturu. ${expedition}</p>
            <p>Fakturu si pečlivě uschovejte, obvykle slouží i jako záruční list k zakoupenému zboží.</p>`
        ];
    }
    static paymentSuccess({ variableSymbol }) {
        return [
            `Keramika Rosice: Úspěšná platba`,
            `<h2>Objednávka #${variableSymbol}</h2>
            <h3 style="font-size: 22px;">Keramika Rosice</h3><br/><br/>
            <p>Přijali jsme platbu za vaši objednávku.</p>`
        ];
    }
    static paymentError({ variableSymbol }) {
        return [
            `Keramika Rosice: Nepovedená platba`,
            `<h2>Objednávka #${variableSymbol}</h2>
            <h3 style="font-size: 22px;">Keramika Rosice</h3><br/><br/>
            <p>Platba kartou se nepovedla. Buďto jste jí zrušili, nebo došlo k problému s platební bránou Stripe.</p>
            <p>Prosím, kontaktujte nás na e-mailu keramikarosice@seznam.cz a domluvíme se na dalším postupu.</p>`
        ];
    }
    static canceledOrder({ variableSymbol }) {
        return [
            `Keramika Rosice: Zrušení objednávky`,
            `<h2>Objednávka #${variableSymbol}</h2>
            <h3 style="font-size: 22px;">Keramika Rosice</h3><br/><br/>
            <p>Vaše objednávka byla úspěšně zrušena.</p>`
        ];
    }
}

module.exports = EmailTemplates;