const { jsPDF } = require("jspdf");
const path = require("path");
const fs = require('fs');

function generatePDF(values){
	try{
	var doc = new jsPDF();
	const imagePath = path.join(__dirname,'..','public','static','logo-pdf.png');
	const imageData = fs.readFileSync(imagePath).toString('base64');
	const imageBase64 = 'data:image/png;base64,' + imageData;
	doc.addImage(imageBase64, 'PNG', 10, 8, 60, 13);
doc.setFontSize(11);
doc.setDrawColor(0, 0, 0);
doc.text("Accession Number", 120, 14);
doc.rect(155, 10, 45, 6);
doc.setFontSize(11);
doc.setTextColor(0, 120, 0);
doc.text("", 86, 19);


doc.setDrawColor(222, 165, 43);
doc.setLineWidth(1.5);
doc.line(10, 25, 200, 25)

//first section starts
doc.setDrawColor(0);
doc.setLineWidth(0)
doc.setFillColor(89, 89, 89);
doc.rect(10, 28, 190, 10, "FD");

doc.setFontSize(14);
doc.setTextColor(255,255,255);
doc.text("PROVIDER INFORMATION", 79, 34);

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(10, 38, 190, 31, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(12, 40, 42, 8, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(55, 40, 15, 8, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(71, 40, 42, 8, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(114, 40, 42, 8, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(157, 40, 41, 8, "FD");


doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89); 
doc.setFillColor(242,242,242);
doc.rect(12, 50, 42, 8, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(55, 50, 42, 8, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(98, 50, 42, 8, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(141, 50, 15, 8, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(157, 50, 15, 8, "FD");


doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(173, 50, 25, 8, "FD");

doc.setFontSize(13);
doc.setTextColor(228, 0, 58);
doc.text("Physician/Provider", 12, 66.75);
doc.setFontSize(13);
doc.setTextColor(0, 0, 255);
doc.text("", 62, 65.75);

doc.setDrawColor(228, 0, 58);
doc.setLineWidth(0.5)
doc.line(57, 66.75, 111, 66.75); 

doc.setFontSize(13);
doc.setTextColor(228, 0, 58);
doc.text("Date Signed", 115, 66.75);
doc.setFontSize(13);
doc.setTextColor(0, 0, 255);
doc.text("", 153, 65.75);

doc.setDrawColor(228, 0, 58);
doc.setLineWidth(0.5)
doc.line(148, 66.75, 198, 66.75); 

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("FIRST NAME", 13, 42.5);

doc.setFontSize(9);
doc.setTextColor(0,15,255);
doc.text(values.firstName, 13, 46.5);


doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("MI", 56, 42.5);

doc.setFontSize(9);
doc.setTextColor(0,15,255);
doc.text(values.mi, 56, 46.5);

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("LAST NAME", 72, 42.5);

doc.setFontSize(9);
doc.setTextColor(0,15,255);
doc.text(values.lastName, 72, 46.5);

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("PHONE", 115, 42.5);
doc.setFontSize(9);
doc.setTextColor(0,15,255);
doc.text(values.phone, 115, 46.5);


doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("EMAIL", 158, 42.5);
doc.setFontSize(9);
doc.setTextColor(0,15,255);
doc.text(values.email, 158, 46.5);

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("ADDRESS 1", 13, 52.5);
doc.setFontSize(9);
doc.setTextColor(0,15,255);
doc.text(values.address1, 13, 56.5);

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("ADDRESS 2", 56, 52.5);
doc.setFontSize(9);
doc.setTextColor(0,15,255);
doc.text(values.address2, 56, 56.5);


doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("CITY", 99, 52.5);
doc.setFontSize(9);
doc.setTextColor(0,15,255);
doc.text(values.city, 99, 56.5);

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("STATE", 142, 52.5);
doc.setFontSize(9);
doc.setTextColor(0,15,255);
doc.text(values.state, 142, 56.5);

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("ZIP", 158, 52.5);
doc.setFontSize(9);
doc.setTextColor(0,15,255);
doc.text(values.zip, 158, 56.5);

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("PROVIDER ID (NPI)", 174, 52.5);
doc.setFontSize(9);
doc.setTextColor(0,15,255);
doc.text(values.npi, 174, 56.5);

//second section starts
doc.setDrawColor(0);
doc.setLineWidth(0)
doc.setFillColor(89, 89, 89);
doc.rect(10, 71, 190, 10, "FD");

doc.setFontSize(14);
doc.setTextColor(255,255,255);
doc.text("PATIENT INFORMATION", 81, 77);

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(10, 81, 190, 42, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(12, 83, 50, 8, "FD");


doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(63, 83, 50, 8, "FD");


doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(157, 83, 41, 8, "FD");


doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(114, 83, 42, 8, "FD");

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("FIRST NAME", 14, 85.5);
doc.setFontSize(9);
doc.setTextColor(0,0,255);
doc.text("", 14, 89.5);

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("LAST NAME", 65, 85.5);
doc.setFontSize(9);
doc.setTextColor(0,0,255);
doc.text("", 65, 89.5);

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("DOB", 115, 85.5);
doc.setFontSize(9);
doc.setTextColor(0,0,255);
doc.text("", 115, 89.5);

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("PHONE", 159, 85.5);
doc.setFontSize(9);
doc.setTextColor(0,0,255);

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(12, 93, 84, 8, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(98, 93, 42, 8, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(141, 93, 34, 8, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(176, 93, 22, 8, "FD");

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("ADDRESS", 14, 96);
doc.setFontSize(9);
doc.setTextColor(0,0,255);
// doc.text("23, Emily Lane", 14, 100);

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("CITY", 100, 96);
doc.setFontSize(9);
doc.setTextColor(0,0,255);
// doc.text("Nevada", 100, 100);

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("STATE", 142, 96);
doc.setFontSize(9);
doc.setTextColor(0,0,255);
// doc.text("TX", 142, 100);

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("ZIP", 178, 96);
doc.setFontSize(9);
doc.setTextColor(0,0,255);
// doc.text("98332", 178, 100);
// 

// second section third inner section

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(12, 103, 78, 8, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(91, 103, 49, 8, "FD");

doc.setFontSize(6.4);
doc.setTextColor(0,0,0);
doc.text("GENDER", 92, 105.5);

doc.setDrawColor(0,0,0);
doc.setLineWidth(0.05);
doc.setFillColor(0, 0, 255)
doc.circle(96, 108, 1.35, 'D');


doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("MALE", 100, 109);


doc.setDrawColor(0,0,0);
doc.setLineWidth(0.05);
doc.circle(118, 108, 1.35, 'D');

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text("FEMALE", 122, 109);


doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(141, 103, 57, 8, "FD");


doc.setFontSize(6.4);
doc.setTextColor(0,0,0);
doc.text("ETHNICITY", 142, 105.5);

doc.setDrawColor(0,0,0);
doc.setLineWidth(0.05);
doc.circle(145, 108, 1.25, 'D');

doc.setFontSize(7.5);
doc.setTextColor(0,0,0);
doc.text("Hispanic/Latino", 147, 109);

doc.setDrawColor(0,0,0);
doc.setLineWidth(0.05);
doc.setFillColor(0,0,255);
doc.circle(169, 108, 1.35, 'D');

doc.setFontSize(7.5);
doc.setTextColor(0,0,0);
doc.text("Not Hispanic/Latino", 171, 109);


doc.setFontSize(6.4);
doc.setTextColor(0,0,0);
doc.text("EMAIL", 14, 105.5);
doc.setFontSize(9);
doc.setTextColor(0,0,255);
// doc.text("jacobs.john@gmail.com", 14, 109.5);


// second section fourth inner section
doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(12, 113, 186, 8, "FD");


doc.setFontSize(6.4);
doc.setTextColor(0,0,0);
doc.text("RACE", 14, 115.5);

doc.setDrawColor(0,0,0);
doc.setLineWidth(0.05);
doc.circle(22, 117.2, 1.35, 'D');
doc.setFontSize(8);
doc.setTextColor(0,0,0);
doc.text("American Indian", 25, 118.4);

doc.setDrawColor(0,0,0);
doc.setLineWidth(0.05);
doc.setFillColor(0,0,255);
doc.circle(54, 117.2, 1.35, 'D');
doc.setFontSize(8);
doc.setTextColor(0,0,0);
doc.text("Alaskan Native", 57, 118.4);

doc.setDrawColor(0,0,0);
doc.setLineWidth(0.05);
doc.circle(82, 117.2, 1.35, 'D');
doc.setFontSize(8);
doc.setTextColor(0,0,0);
doc.text("White", 85, 118.4);

doc.setDrawColor(0,0,0);
doc.setLineWidth(0.05);
doc.circle(97, 117.2, 1.35, 'D');
doc.setFontSize(8);
doc.setTextColor(0,0,0);
doc.text("African American", 100, 118.4);

doc.setDrawColor(0,0,0);
doc.setLineWidth(0.05);
doc.circle(124, 117.2, 1.35, 'D');
doc.setFontSize(8);
doc.setTextColor(0,0,0);
doc.text("Native Hawaiian", 127, 118.4);

doc.setDrawColor(0,0,0);
doc.setLineWidth(0.05);
doc.circle(152, 117.2, 1.35, 'D');
doc.setFontSize(8);
doc.setTextColor(0,0,0);
doc.text("Pacific Islander", 155, 118.4);

doc.setDrawColor(0,0,0);
doc.setLineWidth(0.05);
doc.circle(180, 117.2, 1.35, 'D');
doc.setFontSize(8);
doc.setTextColor(0,0,0);
doc.text("Other", 183, 118.4);

// second section ends


// THIRD SECTION STARTS
doc.setDrawColor(0);
doc.setLineWidth(0)
doc.setFillColor(89, 89, 89);
doc.rect(10, 125, 190, 10, "FD");

doc.setFontSize(14);
doc.setTextColor(255,255,255);
doc.text("INFORMED CONSENT", 81, 132);

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(10, 135, 190, 30, "FD");

doc.setFontSize(7);
doc.setTextColor(0,0,0);
doc.text([
'CONSENTING TO THIS TEST REQUIRES THAT YOU UNDERSTAND THE FOLLOWING:',
'YOU INDEMNIFY THE ORDERING PHYSICIAN AND THE TESTING LABORATORY, YOU AGREE TO THE REPORTING OF RESULTS',
'TO THE CLIENT LISTED ABOVE AND TO YOUR EMAIL ADDRESS, YOU AGREE TO FOLLOWUP WITH YOUR OWN PHYSICIAN',
'WITH YOUR RESULTS, AND YOU AGREE THAT WE MAY USE YOUR SAMPLE AND THE FOLLOWING INFORMATION FOR RESEARCH PURPOSES.',
'PROVIDING THIS EXTRA INFORMATION WILL PROVIDE SIGNIFICANT INFORMATION FOR THE DEVELOPMENT OF EFFECTIVE DIAGNOSTICS.',
' ',
' ',
'PLEASE SIGN BELOW IF YOU AGREE AND CONSENT :'
], 13, 142);


// THIRD SECTION SECOND INNER SECTION
doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(255,230,153);
doc.rect(10, 165, 190, 10, "FD");

doc.setFontSize(9);
doc.setTextColor(0,0,0);
doc.text(`Parent Signature:`, 13, 170);
doc.text(`Date Signed:`, 103, 170);



// Fourth Section
doc.setDrawColor(0);
doc.setLineWidth(0)
doc.setFillColor(89, 89, 89);
doc.rect(10, 177, 190, 10, "FD");

doc.setFontSize(14);
doc.setTextColor(255,255,255);
doc.text("FOR LAB USE ONLY", 81, 183.5);

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(10, 187, 190, 78, "FD");

doc.setFontSize(10);
doc.setTextColor(0,0,0);
doc.text([
'These steps correspond to steps listed in the instruction guide. See guide for more details.',
' ',
'Collection Date                                                                 Tech Collecting sample (initials)',
' ',
'Collection Time                                                                 Tech Processing sample (initials)',
' ',
'Step 1: Time first centrifugation began                                    am / pm',
' ',
'Was brake disabled on centrifuge?          Yes             No',
' ',
'Step 2: Transfer plasma from blood collection tube to 15mL centrifuge tube (check when complete)',
' ',
'Step 3: Time second centrifugation began                                   am / pm',
' ',
'Step 4: Transfer plasma into new cryovial or centrifuge tube (check when complete)',
'Step 5: If couriering sample: refrigerate samples until couriered on ice packs. If shipping sample: Recommend',
'refrigerating sample for at least 2 hours before shipping on ice packs. (see instructions)'
], 13, 193);

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(154, 197, 45, 6, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(154, 205, 45, 6, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(40, 197, 45, 6, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(40, 205, 45, 6, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(75, 213, 30, 6, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(80, 237.5, 30, 6, "FD");


doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(170, 229.5, 8, 6, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(146, 245, 8, 6, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(70, 222, 5, 5, "FD");

doc.setLineWidth(0.1);
doc.setDrawColor(89, 89, 89);
doc.setFillColor(242,242,242);
doc.rect(87, 222, 5, 5, "FD");



// footer
doc.setDrawColor(251, 199, 23);
doc.setLineWidth(0)
doc.setFillColor(251, 199, 23);
doc.rect(0, 267, 210, 30, "FD");

doc.setFontSize(8);
doc.setTextColor(0,0,0);
doc.text("New Day Diagnostics", 90, 274);

doc.setFontSize(8);
doc.setTextColor(0,0,0);
doc.text("6701 Baum Drive Suite 110 Knoxville, TN 37919", 70, 278);

doc.setFontSize(8);
doc.setTextColor(0,0,0);
doc.text("Toll Free (844) EDP-3938 | www.NewDayDiagnostics.com | info@NewDayDiagnostics.com", 35, 282);

doc.setFontSize(8);
doc.setTextColor(0,0,0);
doc.text("Medical Laboratory Director: Dr. Melissa Chiles, MD (TN LIC# 0000039233)", 45, 286);

doc.setFontSize(8);
doc.setTextColor(0,0,0);
doc.text("New Day Diagnostics IS A CLIA APPROVED (CLIA# 44D2184836) TESTING LABORATORY AND ISO 13845:2016 R&D and MEDICAL DEVICE FACILITY", 5, 290);

	doc.save(path.join(__dirname, `../provider_blank_requisitions/${values._id}_${values.firstName}_${values.lastName}.pdf`));
	return true;
} catch(err){
	console.log(err);
	return false;
}
}

module.exports = generatePDF;


