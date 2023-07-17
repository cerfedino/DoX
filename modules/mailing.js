/**
 * 
 * Responsible of sending and handling email verification.
 * 
 */

const nodemailer = require('nodemailer');
const dbops = require('./dbops.js')

const email_credentials = require('../config/config.js').mailing;



// to send email, it provides the service and the email credentials
var transporter = nodemailer.createTransport({
	service: 'gmail',
  	auth: email_credentials
});

// Periodically checks for expired verification links
async function check_expired_verification_links() {
	const users = (await dbops.run_find(dbops.model.users,{email_verification_status: false, joined_date: {"$lte": new Date(new Date().getTime() - email_credentials.verification_link_expiry)}},{_id:1}))
	for(var i = 0; i<users.length; i++) {
		await dbops.user_delete(users[i]._id)
	}
}
setInterval(check_expired_verification_links, email_credentials.verification_links_check)

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
 * Generates a text message for email confirmation (for users who do not support html)
 * @param {String} user the username
 * @param {String} address the email
 * @param {String} verification_link the link to check email confirmation
 * @returns {String} a text mail content
 */
 function generate_email_text_message(user, address, verification_link) {
	return `DoX
	
Almost done, @${user}!
To complete your email change request, we just need to verify your new email address: ${address}.
	
Paste the following link into your browser: ${verification_link}

Once verified, you can continue using DoX with your new email address.

—————————————————————————————————————
You’re receiving this email because you recently requested an email change for your DoX account. If this wasn’t you, please ignore this email.


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
	<header style="padding:30px; background-color: #E63946;"><h1 style="text-align: center; color:white">DoX</h1></header>
	
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
 * Generates an html message 
 * @param {String} user the username
 * @param {String} address the email
 * @param {String} verification_link the link to check email confirmation
 * @returns {String} an html mail content
 */
 function generate_email_html_message(user, address, verification_link) {
	return `<!DOCTYPE html>
	<header style="padding:30px; background-color: #E63946;"><h1 style="text-align: center; color:white">DoX</h1></header>
	
	<div style="border: 1px solid gray; border-radius: 20px; margin:20px 10%; padding:20px; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;" >
		
		<section style="font-size: larger;">
			<p>Almost done, <b style='color:#E63946' >@${user}</b>!</p>
			<p style="color:black">To complete your email change request, we just need to verify your new email address: ${address}.</p>
		</section>
	
		<a style="box-sizing:border-box;text-decoration:none;background-color:#E63946;border-radius:5px;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;border:1px solid #E63946" href="${verification_link}" target="_blank">Verify email address</a>
	
		<section style="font-size:medium; color:black">
			<p>Once verified, you can continue using DoX with your new email address.</p>
		</section>
		<br>
		<hr>
	
		<section style="font-size: small; font-family: monospace; color:black">
			<p>Button not working? Paste the following link into your browser: <a href="${verification_link}">${verification_link}</a></p>
			<p style="color:black">You’re receiving this email because you recently requested an email change for your DoX account. If this wasn’t you, please ignore this email.</p>
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
		console.log('[+] Sent verification email to:', address);
	});

}

/**
 * To send emails for email change confirmation
 * @param {String} user the username
 * @param {String} address the email
 * @param {String} verification_link the link to check email confirmation
 */
 function send_email_change(user, address, verification_link) {
	let mailOptions = {
		from: 'noreply.mailserver.dox@gmail.com',
		to: address,
		subject: 'DoX: change your email',
		text: generate_email_text_message(user, address, verification_link),
		html: generate_email_html_message(user, address, verification_link)
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error.message);
		}
		console.log('Sent email change request email to:', address);
	});

}


module.exports = {send_mail, send_email_change}