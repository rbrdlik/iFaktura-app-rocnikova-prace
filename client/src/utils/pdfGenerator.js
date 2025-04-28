import jsPDF from "jspdf"
import jsPdfAutoTable from "jspdf-autotable"
import logo from "../assets/logo/IFakturaLogoDark.png";

// Import fonts
import "../assets/font/DejaVuSans-normal"
import "../assets/font/DejaVuSans-Bold-normal"
import "../assets/font/DejaVuSans-ExtraLight-normal"

// Import utils 
import { calculateTotals } from "./calculateTotals";

/**
 * Tato funkce převádí url adresu obrázku na Base64 formát aby se mohl obrázek zobrazit na pdf formátu faktury
 * @param {*} url - url adresa obrázku
 */
const getImageBase64FromUrl = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
   
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // Base64
      reader.readAsDataURL(blob);
    });
  };

export const generatePDF = async (user, contact, invoice, totalPrice, image) => {
    const doc = new jsPDF();
    
    let convertedImage = null;

    if(image){
        try{
            convertedImage = await getImageBase64FromUrl(`http://localhost:3000/uploads/${image}`);
        } catch(err){
            console.log(err.message)
        }
    }

    const userData = user;
    const contactData = contact.payload;
    const invoiceData = invoice;

    const convertDate = (dateInput) => {
        const date = new Date(dateInput);
        return date.toLocaleDateString("cs-CZ");
    };

    // ŠABLONY TEXTU
    function textSize11(doc, text, x, y, style){
        if(style === "light") doc.setFont("DejaVuSans-ExtraLight", "normal");
        else if(style === "bold") doc.setFont("DejaVuSans-Bold", "normal");
        else if(style === "normal") doc.setFont("DejaVuSans", "normal");
        
        doc.setFontSize(11);
        doc.text(text, x, y);
    }

    function textSize10(doc, text, x, y, style){
        if(style === "light") doc.setFont("DejaVuSans-ExtraLight", "normal");
        else if(style === "bold") doc.setFont("DejaVuSans-Bold", "normal");
        else if(style === "normal") doc.setFont("DejaVuSans", "normal");

        doc.setFontSize(10);
        doc.text(text, x, y);
    }

    function textSize9(doc, text, x, y, style){
        if(style === "light") doc.setFont("DejaVuSans-ExtraLight", "normal");
        else if(style === "bold") doc.setFont("DejaVuSans-Bold", "normal");
        else if(style === "normal") doc.setFont("DejaVuSans", "normal");

        doc.setFontSize(9);
        doc.text(text, x, y);
    }

    function textSize8(doc, text, x, y, style){
        if(style === "light") doc.setFont("DejaVuSans-ExtraLight", "normal");
        else if(style === "bold") doc.setFont("DejaVuSans-Bold", "normal");
        else if(style === "normal") doc.setFont("DejaVuSans", "normal");

        doc.setFontSize(8);
        doc.text(text, x, y);
    }

    // Logo
    if (convertedImage) {
        doc.addImage(convertedImage, 'PNG', 12, 6, 37, 11);
    }

    // Číslo faktury
    textSize8(doc, `Faktura č. ${invoiceData.invoice_id}`, 162, 13.5, "bold")
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(160, 8.5, 40, 8, 'S');

    // Dodavatel
    textSize10(doc, "Dodavatel", 12, 24.5, "bold")

    textSize11(doc, userData.detailsName, 12, 30, "bold")

    textSize9(doc, userData.street, 12, 34.5, "normal")
    textSize9(doc, `${userData.zipCode} ${userData.city}`, 12, 38.5, "normal")
    textSize9(doc, userData.hasIco ? `IČO: ${userData.ico}` : "", 12, 42.5, "normal")
    textSize9(doc, userData.dph === "Plátce DPH" ? `DIČ: ${userData.dic}` : "Neplátce DPH", 12, 46.5, "normal")

    // Kontaktní údaje
    textSize10(doc, "Kontaktní údaje", 12, 60, "bold")

    textSize9(doc, `E-Mail: ${userData.email}`, 12, 64.5, "normal")
    textSize9(doc, userData.phone ? `Telefon: ${userData.phone}` : "", 12, 68.5, "normal")
    textSize9(doc, userData.website ? `Web: ${userData.website}` : "", 12, 72.5, "normal")

    textSize9(doc, "Způsob platby:", 12, 87, "normal")
    textSize9(doc, invoiceData.paymentMethod, 37, 87, "bold")

    // |
    doc.setDrawColor(200,200,200);
    doc.line(105, 18, 105, 93);

    // Odběratel
    textSize10(doc, "Odběratel", 115, 24.5, "bold")

    textSize11(doc, contactData ? contactData.detailsName : "Chyba při načítání odběratele...", 115, 30, "bold")
    
    textSize9(doc, contactData ? contactData.street : "", 115, 34.5, "normal")
    textSize9(doc, contactData ? `${contactData.zipCode} ${contactData.city}` : "", 115, 38.5, "normal")
    textSize9(doc, contactData ? (contactData.ico ? `IČO: ${contactData.ico}` : "") : "", 115, 42.5, "normal")
    textSize9(doc, contactData ? (contactData.dic ? `DIČ: ${contactData.dic}` : "Neplátce DPH") : "", 115, 46.5, "normal")

    // Kontaktní údaje odběratele
    textSize10(doc, contactData ? "Kontaktní údaje" : "", 115, 60, "bold")
    textSize9(doc, contactData ? `E-Mail: ${contactData.email}` : "", 115, 64.5, "normal")
    textSize9(doc, contactData ? (contactData.phone ? `Telefon: ${contactData.phone}` : "") : "", 115, 68.5, "normal")
    textSize9(doc, contactData ? (contactData.website ? `Web: ${contactData.website}` : "") : "", 115, 72.5, "normal")

    textSize9(doc, "Číslo objednávky:", 115, 87, "normal")
    textSize9(doc, invoiceData.orderNumber, 144, 87, "bold")

    // Box
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(12, 99, 135, 28, 'S');

    textSize8(doc, invoiceData.paymentMethod === "Bankovní převod" ? "Bankovní účet" : invoiceData.paymentMethod === "PayPal" ? "PayPal" : "Dobírkou", 14, 105, "bold")

    textSize8(doc, invoiceData.paymentMethod === "Bankovní převod" ? userData.accountNumber : invoiceData.paymentMethod === "PayPal" ? `E-Mail: ${userData.email}` : "Dobírka – částka bude hrazena při doručení.", 14, 112, "bold")
    textSize8(doc, invoiceData.paymentMethod === "Bankovní převod" ? `IBAN: ${userData.iban}` : "", 14, 116, "bold")
    textSize8(doc, invoiceData.paymentMethod === "Bankovní převod" ? `SWIFT: ${userData.swift}` : "", 14, 120, "bold")

    textSize8(doc, "Symbol", 90, 105, "bold")

    textSize8(doc, "Variabilní:", 90, 112, "normal")
    textSize8(doc, invoiceData.invoice_id, 108, 112, "bold")

    // Datumy
    textSize8(doc, "Datum vystavení:", 150, 109, "normal")
    textSize8(doc, "Datum splatnosti:", 150, 113, "normal")
    textSize8(doc, invoiceData.duzp ? "DUZP:" : "", 150, 117, "normal")

    textSize8(doc, convertDate(invoiceData.dateOfIssuing), 178, 109, "bold")
    textSize8(doc, convertDate(invoiceData.dueDate), 178, 113, "bold")
    textSize8(doc, invoiceData.duzp ? convertDate(invoiceData.duzp) : "", 178, 117, "bold")

    // Tabulka
    let head = [];
    if(userData.dph === "Plátce DPH"){
        head = [['Popis produktu                            ', '   Množství,  M.J.', '   Cena za množství', '   DPH (%)', '   Bez DPH', '   DPH' ,'   Cena celkem']];
    } else{
        head = [['Popis produktu                            ', '   Množství,  M.J.', '   Cena za množství', '', '', '', '   Cena celkem']];
    }
    const body =  invoiceData.products.flatMap((product) => {
        const totals = calculateTotals(product);

        const mainRow = [
            `${product.productName}`,
            `${product.amount} ${product.unit}`,
            `${parseFloat(product.price).toFixed(2)} Kč`,
            `${userData.dph === "Plátce DPH" ? product.dph : ""}`,
            `${userData.dph === "Plátce DPH" ? totals.priceWithoutDph+" Kč" : ""}`,
            `${userData.dph === "Plátce DPH" ? totals.dphAmount+" Kč" : ""}`,
            `${userData.dph === "Plátce DPH" ? totals.totalWithDph : parseFloat(product.price * product.amount).toFixed(2)} Kč`
        ]

        const discountRow = product.discount ? [
            `└ Sleva ${product.discount} ${product.discountType}`,
            '',
            '',
            '',
            '',
            '',
            `-${totals.discountAmount} Kč`
        ] : ""

        if(product.discount){
            return [mainRow, discountRow]
        } else {
            return [mainRow]
        }
    })
    
    let endY;
    doc.autoTable({
        head: head,
        body: body,
        startY: 140,
        theme: 'striped',
        styles: {
            font: 'DejaVuSans',
            fontSize: 8,
            halign: 'right',
            valign: 'middle',
            cellPadding: 1.5,
            overflow: 'linebreak',
        },
        headStyles: {
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [255, 255, 255],
        },
        columnStyles: {
            0: { halign: 'left', cellWidth: 50 },
            1: { halign: 'right' },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right' },
            6: { halign: 'right' }
        },
        margin: { left: 12, bottom: 15 },
        didDrawPage: function (data) {
            endY = data.cursor.y;
        }
    });

    // Footer
    doc.setDrawColor(200,200,200);
    doc.line(12, 275, 200, 275);

    textSize8(doc, "Vystaveno v aplikaci iFaktura", 85, 280, "normal")
    
    // Celkem 
    doc.setFillColor(200, 200, 200);
    doc.rect(110, endY+7, 85, 12, 'F');
    
    textSize11(doc, `Celkem k úhradě:  ${totalPrice} Kč`, 115, endY+14.5, "bold")

    const pdfUrl = doc.output("bloburl");
    window.open(pdfUrl, "_blank");
}