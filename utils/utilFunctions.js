const PRINT_LOGS = process.env.PRINT_LOGS === 'true';

function getRandomString(text){
	return text + Math.floor((Math.random() * 100000) + 1);
}

function getRandomInt(){
	return Math.floor((Math.random() * 100000) + 1);
}

function getRandomAmount(){
	return ((Math.random() * 100) + 1).toFixed(2);
}

function getDate(){
	return (new Date()).toISOString().substring(0, 10) ;
}


module.exports.getRandomString = getRandomString;
module.exports.getRandomInt = getRandomInt;
module.exports.getRandomAmount = getRandomAmount;
module.exports.getDate = getDate;

exports.getLastTwelveMonths = () => {
	const months = [];
	const currentDate = new Date();
	for (let i = 0; i < 12; i++) {
		const month = currentDate.getMonth() - i;
		const year = currentDate.getFullYear() + Math.floor((currentDate.getMonth() - i) / 12);
		const date = new Date(year, month, 1);
		const monthNumber = date?.getMonth() + 1; // Get the month number
		const formattedMonth = monthNumber < 10 ? `0${monthNumber}` : monthNumber;
		months.push(`${year}-${formattedMonth}&&${date.toLocaleString("default", { month: "long" })} ${year}`);
	}
	return months;
}

exports.getFormattedDate = (dateString) => {
	const date = new Date(dateString);
	const pad = (num) => { if (num < 10) { return `0${num}` } else return `${num}` };
	const monthNameArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const daySuffix = (day) => {
		if (day >= 11 && day <= 13) {
			return `${day}th`;
		}
		switch (day % 10) {
			case 1: return `${day}st`;
			case 2: return `${day}nd`;
			case 3: return `${day}rd`;
			default: return `${day}th`;
		}
	}
	const month = monthNameArray[date.getMonth()];
	const day = daySuffix(date.getDate());
	const year = date.getFullYear();
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const ampm = date?.getHours() > 12 ? 'pm' : 'am'
	return `${month} ${day} ${year}, ${hours}:${minutes}${ampm}`
}

exports.generateOTP = () => {
	const randomNumber = Math.floor(Math.random() * 90000) + 10000;
	return randomNumber;
}

exports.getTrimmedObject = (obj) => {
	if (!Object.keys(obj)?.length > 0) return null;
	for (let key of Object.keys(obj)) {
		if (typeof obj[key] === 'string') {	
			obj[key] = obj[key].trim();
		}
		else if (typeof obj[key] === 'object') {
			obj[key] = getTrimmedObject(obj[key])
		}
	}
	return obj;
}

exports.log = (...messages) => {
	if (PRINT_LOGS) {
		messages.forEach(msg => {
			console.log(msg);
		})
	}
}

exports.sendInvoiceEmail = (orderData) => {
	return `
	<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal;margin:0px auto;max-width:800px;width:100%;background-color: #ffffff;" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
	<tbody>
		 <tr>
				<td style="height: 10px; background-color: #ff7637;"></td>
		 </tr>
		 <tr>
				<td style=" padding: 0px 50px;">
					 <div>
							<h3 style="line-height: 20px;display: flex;align-items: center;margin: 0px;font-size: 24px;"><figure style="margin: 10px 25px 10px 0px; "><img src="./logo.png" width="50"></figure> Indore Battery</h3>
							<p style="margin: 0px;width: 200px;line-height: 20px;font-family: sans-serif; font-weight: 400;color: #787878;margin-top: 5px;">22, Gulab Bagh, Near Dewas Naka, Indore M.P 452010</p>
					 </div>
				</td>
		 </tr>
		 <tr>
				<td style=" padding: 0px 50px;">
					 <h1 style="line-height:24px;">Invoice</h1>
					 <p style="margin: 0px; font-weight: 600;color: #484848;">Submitted on ${this.getFormattedDate(new Date().toLocaleDateString())}</p>
				</td>
		 </tr>
		 <tr>
				<td style=" padding: 0px 50px;">
					 <table cellspacing="0" cellpadding="0" width="100%" style="border-bottom: 1px solid #787878;padding-top: 20px;padding-bottom: 10px;">
							<tr>
								 <td style="width:40%;vertical-align: top;">
										<p style="margin: 0;line-height: 30px; font-weight: 600;margin-top: 10px;">Invoice for</p>
										<p style="margin: 0;line-height: 20px; font-weight: 500;color:#787878;font-size:14px">${orderData?.buyerInformation?.firstName+" "+orderData?.buyerInformation?.lastName}</p>
										<p style="margin: 0;line-height: 20px; font-weight: 500;color:#787878;font-size:14px">${orderData?.buyerInformation?.phone}</p>
										<p style="margin: 0;line-height: 20px; font-weight: 500;color:#787878;font-size:14px">${orderData?.billingAddress?.addressLineOne+" "+orderData?.billingAddress?.addressLineTwo}</p>
										<p style="margin: 0;line-height: 20px; font-weight: 500;color:#787878;font-size:14px">${orderData?.billingAddress?.city+ ", "+ orderData?.billingAddress?.state+", "+orderData?.billingAddress?.zip }</p>
								 </td>
								 <td style="width:60%">
										<table width="100%">
											 <tr>
													<td>
														 <p style="margin: 0;line-height: 30px; font-weight: 600;margin-top: 10px;">Payable To</p>
														 <p style="margin: 0;line-height: 20px; font-weight: 500;color:#787878;font-size:14px">Indore Battery</p>
													</td>
													<td>
														 <p style="margin: 0;line-height: 30px; font-weight: 600;margin-top: 10px;">Invoice #</p>
														 <p style="margin: 0;line-height: 20px; font-weight: 500;color:#787878;font-size:14px">${orderData?.orderId}</p>
													</td>
											 </tr>
											 <tr>
													<td>
														 <p style="margin: 0;line-height: 30px; font-weight: 600;margin-top: 10px;">Delivery Status</p>
														 <p style="margin: 0;line-height: 20px; font-weight: 500;color:#787878;font-size:14px">${orderData?.deliveryStatus}</p>
													</td>
													<td>
														 <p style="margin: 0;line-height: 30px; font-weight: 600;margin-top: 10px;">Order Date</p>
														 <p style="margin: 0;line-height: 20px; font-weight: 500;color:#787878;font-size:14px">${this.getFormattedDate(orderData?.createdAt)}</p>
													</td>
											 </tr>
										</table>
								 </td>
							</tr>
					 </table>
				</td>
		 </tr>
		 <tr>
				<td style=" padding: 0px 50px;">
					 <table width="100%" style="padding-top: 25px;" cellspacing="0" cellpadding="0">
							<thead>
								 <tr>
										<th style="padding:5px;color:#484848;font-weight: 600;padding-bottom: 8px;">Product</th>
										<th style="padding:5px;color:#484848;font-weight: 600;padding-bottom: 8px;">Quantity</th>
										<th style="padding:5px;color:#484848;font-weight: 600;padding-bottom: 8px;">Unit Price (Rs.)</th>
										<th style="padding:5px;color:#484848;font-weight: 600;padding-bottom: 8px;">Total Price (Rs.)</th>
								 </tr>
							</thead>
							<tbody>
								${
									orderData?.orderItems.map(item => {
										return `
										<tr style="background-color: #FFF8F5;">
											<td style="padding:6px; border-bottom: 1px solid rgba(0,0,0,0.15); font-weight: 500; font-size: 13px;text-align: left;">
												${item?.productName}
											</td>
											<td style="padding:6px; border-bottom: 1px solid rgba(0,0,0,0.15); font-weight: 500; font-size: 13px;text-align: right;">
												${item?.productQuantity}
											</td>
											<td style="padding:6px; border-bottom: 1px solid rgba(0,0,0,0.15); font-weight: 500; font-size: 13px;text-align: right;">
												${item?.productPrice}/-
											</td>
											<td style="padding:6px; border-bottom: 1px solid rgba(0,0,0,0.15); font-weight: 500; font-size: 13px;text-align: right;">
												${item?.productPrice}/-
											</td>
										</tr>
										`
									}).join('\n')
								}
								 <tr>
										<td colspan="3" style="text-align: right;padding:6px; font-weight: 500; font-size: 13px;color: #CD5C08;">
											 Subtotal:
										</td>
										<td colspan="1" style="text-align: right;font-weight: 700; font-size: 13px; color: #484848;">
											 Rs ${orderData?.subTotal}
										</td>
								 </tr>
								 <tr>
										<td colspan="3" style="text-align: right;padding:6px; font-weight: 500; font-size: 13px;color: #CD5C08;">
											 Discounts and Adjustments:
										</td>
										<td colspan="1" style="text-align: right;font-weight: 600; font-size: 13px; color: #686868;">
											 - Rs ${orderData?.subTotal * (100 - orderData?.discount)}
										</td>
								 </tr>
								 <tr>
										<td colspan="4" style="text-align:right;font-size: 22px;color: #ff7637;font-weight: 600;border-top: 1px solid #e5e5e5;border-bottom: 1px solid #e5e5e5;padding: 10px 0px;">
											 Rs ${orderData?.orderTotal}
										</td>
								 </tr>
							</tbody>
					 </table>
				</td>
		 </tr>
		 <tr>
				<td style=" padding: 0px 50px;">
					 <p style="margin: 0;line-height: 20px; font-weight: 500;font-size: 12px;">Kindest Regards.</p>
					 <p style="margin: 0;line-height: 20px; font-weight: 500;font-size: 12px;">We are pleased to be at your service. Shop more exciting products at <a href="#">Battery Indore</a></p>
					 <p style="margin: 0;line-height: 20px; font-weight: 500;font-size: 12px;">Reach out to us for any queries.</p>
				</td>
		 </tr>
	</tbody>
</table>
	`
}

