//send form
function sendFrom(betreff, textarea){

    // Objekt Erzeugung
    var nodemailer = require('nodemailer');
    // Methode um den Gmail Account zu nutzen
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kontakt.randomwebapplication@gmail.com',
        pass: 'Albstadt007'
      }
    });
    
    var mailOptions = {
      from: 'kontakt.randomwebapplication@gmail.com',
      to: 'kontakt.randomwebapplication@gmail.com',
      subject: betreff,
      text: textarea
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        alert("Ihr Schreiben wurde erfolgreich an uns weitergeleitet!");
      }
    });
    
}
