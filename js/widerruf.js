document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("withdrawalForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const name =
            document.getElementById("withdrawalName").value.trim();

        const email =
            document.getElementById("withdrawalEmail").value.trim();

        const order =
            document.getElementById("withdrawalOrder").value.trim();

        const orderDate =
            document.getElementById("withdrawalOrderDate").value;

        const receivedDate =
            document.getElementById("withdrawalReceivedDate").value;

        const address =
            document.getElementById("withdrawalAddress").value.trim();

        const products =
            document.getElementById("withdrawalProducts").value.trim();


        const subject =
            order
                ? `Widerruf Bestellung ${order}`
                : "Widerruf meiner Bestellung";


        const body = `
Guten Tag,

hiermit widerrufe ich den von mir abgeschlossenen Vertrag über den Kauf der folgenden Ware(n):

${products}

Bestellnummer:
${order || "nicht angegeben"}

Bestellt am:
${orderDate || "nicht angegeben"}

Ware erhalten am:
${receivedDate || "nicht angegeben"}

Name:
${name}

Anschrift:
${address}

E-Mail:
${email}

Mit freundlichen Grüßen

${name}
        `.trim();


        const mailto =
            "mailto:kontakt@boda-snacks.de" +
            "?subject=" +
            encodeURIComponent(subject) +
            "&body=" +
            encodeURIComponent(body);


        window.location.href = mailto;

    });

});
