/**
 * 
 * Responsible of sending and handling email verification.
 * 
 */

const nodemailer = require('nodemailer');

const email_credentials = require('../.email-credentials.js')



// to send email, it provides the service and the email credentials
var transporter = nodemailer.createTransport({
	service: 'gmail',
  	auth: email_credentials
});



/**
 * Generates a text message (for users who do not support html)
 * @param {String} user the username
 * @param {String} address the email
 * @param {String} verification_link the link to check email confirmation
 * @returns {String} a text mail content
 */
function generate_text_message(user, address, verification_link) {
	return `DoX
	
Almost done, @${user}!
To complete your DoX sign up, we just need to verify your email address: ${address}.
	
Paste the following link into your browser: ${verification_link}

Once verified, you can start using DoX to create documents, share them and collab with your friends!

—————————————————————————————————————
You’re receiving this email because you recently created a new DoX account. If this wasn’t you, please ignore this email.


Sent with <3 by the DoX Team.
DoX, Lugano, Switzerland, ${new Date().toUTCString()}
`
}


/**
 * Generates an html message 
 * @param {String} user the username
 * @param {String} address the email
 * @param {String} verification_link the link to check email confirmation
 * @returns {String} an html mail content
 */
function generate_html_message(user, address, verification_link) {
	return `<!DOCTYPE html>
	<header style="padding:30px; background-color: #E63946;"><h1>DoX (logo?)</h1></header>
	
	<div style="border: 1px solid gray; border-radius: 20px; margin:20px 10%; padding:20px; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;" >
		
		<section style="font-size: larger;">
			<p>Almost done, <b style='color:#E63946' >@${user}</b>!</p>
			<p style="color:black">To complete your DoX sign up, we just need to verify your email address: ${address}.</p>
		</section>
	
		<a style="box-sizing:border-box;text-decoration:none;background-color:#E63946;border-radius:5px;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;border:1px solid #E63946" href="${verification_link}" target="_blank">Verify email address</a>
	
		<section style="font-size:medium; color:black">
			<p>Once verified, you can start using DoX to create documents, share them and collab with your friends!</p>
		</section>
		<br>
		<hr>
	
		<section style="font-size: small; font-family: monospace; color:black">
			<p>Button not working? Paste the following link into your browser: <a href="${verification_link}">${verification_link}</a></p>
			<p style="color:black">You’re receiving this email because you recently created a new DoX account. If this wasn’t you, please ignore this email.</p>
		</section>
	
	</div>
	
	
	<div style="text-align: center;">
		<h1 style="color:black">DoX</h1>
		<section style="font-size: small; font-family: monospace; color: gray;">
			<div style="color: gray">Sent with ♡ by DoX</div>
			<div style="color: gray">DoX, Lugano, Switzerland</div>
			<div style="color: gray">${new Date().toUTCString()}</div>
		</section>
	</div>`
}



/**
 * To send emails
 * @param {String} user the username
 * @param {String} address the email
 * @param {String} verification_link the link to check email confirmation
 */
function send_mail(user, address, verification_link) {
	let mailOptions = {
		from: 'noreply.mailserver.dox@gmail.com',
		to: address,
		subject: 'DoX: verify your email',
		text: generate_text_message(user, address, verification_link),
		html: generate_html_message(user, address, verification_link)
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error.message);
		}
		console.log('Sent verification email to:', address);
	});

}



module.exports = {send_mail};