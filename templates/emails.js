class EmailTemplates {
    static newOrder({ id, payment }) {
        let expedition = "<p>Zboží vám bude zasláno do 5 dnů po obdržení platby.</p>";
        if (payment === "DOB") expedition = "";

        return [
            `Keramika Rosice: Nová objednávka`,
            `<h2>Objednávka #${id}</h2>
            <h3 style="font-size: 22px;">Keramika Rosice</h3><br/><br/>
            <p>Přijali jsme vaši objednávku a v příloze zasíláme fakturu. Pečlivě si ji uschovejte, obvykle slouží i jako záruční list k zakoupenému zboží.</p>
            ${expedition}`
        ];
    }
    static paymentSuccess({ id }) {
        return [
            `Keramika Rosice: Úspěšná platba`,
            `<h2>Objednávka #${id}</h2>
            <h3 style="font-size: 22px;">Keramika Rosice</h3><br/><br/>
            <p>Přijali jsme platbu za vaši objednávku.</p>`
        ];
    }
    static paymentError({ id }) {
        return [
            `Keramika Rosice: Nepovedená platba`,
            `<h2>Objednávka #${id}</h2>
            <h3 style="font-size: 22px;">Keramika Rosice</h3><br/><br/>
            <p>Platba kartou se nepovedla. Buďto jste jí zrušili, nebo došlo k problému s platební bránou Stripe.</p>
            <p>Prosím, kontaktujte nás na e-mailu keramikarosice@seznam.cz a domluvíme se na dalším postupu.</p>`
        ];
    }
    static canceledOrder({ id }) {
        return [
            `Keramika Rosice: Zrušení objednávky`,
            `<h2>Objednávka #${id}</h2>
            <h3 style="font-size: 22px;">Keramika Rosice</h3><br/><br/>
            <p>Vaše objednávka byla úspěšně zrušena.</p>`
        ];
    }
}

module.exports = EmailTemplates;