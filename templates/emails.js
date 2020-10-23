class EmailTemplates {
    static newOrder({ id }) {
        return `
            <h2>Objednávka #${id}</h2>
            <h3>Keramika Rosice</h3>
            <p>Úspěšně jste podali objednávku. V přiložené faktuře si můžete prohlédnout detaily.</p>
        `;
    }
}