const monthLookup = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const formatDate = dateString => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = monthLookup[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

function createConfirmationEmailText(order, companyName) {
  let text = `${companyName}\n
Thank you for your order!\n
Hello, ${order.billingAddress.firstName}\n
Thank you for ordering from ${companyName}. We truly appreciate your business!\n
As soon as your order ships, we’ll email you the tracking info. If there are any problems with your order, we'll email you within 24 hours.\n
ORDER #: ${order.orderNumber}\n
--------------------------------------------------------------------------\n
Date: ${formatDate(order.date)}
Status: ${order.status}
Payment Method: ${order.paymentMethod}
Shipping Method: ${order.shippingMethod}\n
Billing Address:
${order.billingAddress.firstName} ${order.billingAddress.lastName}
${order.billingAddress.address1}\n`;

  text += order.billingAddress.address2
    ? `${order.billingAddress.address2}\n`
    : "";
  text += `${order.billingAddress.city}, ${order.billingAddress.state} ${
    order.billingAddress.zip
  }\n
Shipping Address:
${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
${order.shippingAddress.address1}\n`;

  text += order.shippingAddress.address2
    ? `${order.shippingAddress.address2}\n`
    : "";

  text += `${order.shippingAddress.city}, ${order.shippingAddress.state} ${
    order.shippingAddress.zip
  }\n
--------------------------------------------------------------------------\n\n`;

  order.items.forEach(item => {
    text += `${item.name}\n`;

    item.options.forEach((option, i) => {
      text += `${option.name}: ${option.value}${
        item.options.length - 1 === i ? "" : ", "
      }`;
    });

    text += `\n`;
    text += `$${item.price.toFixed(2)}
Qty: ${item.quantity}\n\n`;
  });

  text += `--------------------------------------------------------------------------\n
Subtotal: $${order.subtotal.toFixed(2)}
Shipping: $${order.shipping.toFixed(2)}
Total: $${order.total.toFixed(2)}\n`;

  return text;
}

function createConfirmationEmailHTML(order, companyName) {
  let html = `<div style="background-color: #fff; max-width: 800px; margin: 0 auto; font-family: Helvetica, sans-serif; box-sizing: border-box; padding: 5px;">
  <div style="text-align: center; background-color: #123; padding: 10px; margin-bottom: 30px;">
    <h1 style="margin: 0; color: #fff;">${companyName}</h1>
  </div>
  <div style="margin-bottom: 40px;">
    <h2 style="font-size: 1.75rem">Thank you for your order!</h2>
    <p>Hello ${order.billingAddress.firstName},</p>
    <p>Thank you for ordering from ${companyName}. We truly appreciate your business!</p>
    <p>As soon as your order ships, we’ll email you the tracking info. If there are any problems with your order, we'll email you within 24 hours.</p>
  </div>
  <h2>ORDER #: ${order.orderNumber}</h2>
  <hr style="margin-bottom: 20px;" />
  <table style="width: 100%; table-layout: fixed;">
    <tbody>
      <tr>
        <td>
          <span><b>Date: </b>${formatDate(order.date)}</span>
        </td>
        <td>
          <span><b>Payment Method: </b>${order.paymentMethod}</span>
        </td>
      </tr>
      <tr>
        <td>
          <span><b>Status: </b>${order.status}</span>
        </td>
        <td>
          <span><b>Shipping Method: </b>${order.shippingMethod}</span>
        </td>
      </tr>
      <tr>
        <td>
          <div style="font-weight: bold; margin-top:10px;">Billing Address:</div>
          <div>
            ${order.billingAddress.firstName} ${
    order.billingAddress.lastName
  }<br/>
            ${order.billingAddress.address1}<br/>
            ${
              order.billingAddress.address2
                ? order.billingAddress.address2 + "<br/>"
                : ""
            }
            ${order.billingAddress.city}, ${order.billingAddress.state} ${
    order.billingAddress.zip
  }
          </div>
        </td>
        <td>
          <div style="font-weight: bold; margin-top:10px;">Shipping Address:</div>
          <div>
            ${order.shippingAddress.firstName} ${
    order.shippingAddress.lastName
  }<br/>
            ${order.shippingAddress.address1}<br/>
            ${
              order.shippingAddress.address2
                ? order.shippingAddress.address2 + "<br/>"
                : ""
            }
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${
    order.shippingAddress.zip
  }
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <hr style="margin: 20px 0 10px 0;"/>
        </td>
      </tr>`;

  order.items.forEach(item => {
    html += `<tr>
        <td>
          <h3 style="margin-bottom: 5px; margin-top: 10px;">${item.name}</h3>
          <div style="margin-bottom: 4px">`;

    item.options.forEach((option, i) => {
      html += `${option.name}: ${option.value}${
        item.options.length - 1 === i ? "" : ", "
      }`;
    });

    html += `</div>
          <div>$${item.price.toFixed(2)}</div>
        </td>
        <td style="text-align: right; vertical-align: top;">
          <div style="margin-top: 10px;">Qty: ${item.quantity}</div>
        </td>
      </tr>`;
  });

  html += `<tr>
          <td colspan="2">
            <hr style="margin: 20px 0 10px 0;"/>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <table style="width: 150px; margin-left: auto; text-align: right;">
              <tbody>
                <tr>
                  <td>Subtotal: </td>
                  <td>$${order.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Shipping: </td>
                  <td>$${order.shipping.toFixed(2)}</td>
                </tr>
                <tr style="font-weight: bold;">
                  <td>Total: </td>
                  <td>$${order.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`;

  return html;
}

function createStatusEmailHTML(status, companyName, customerName, orderNumber) {
  let html = `<div style="background-color: #fff; max-width: 800px; margin: 0 auto; font-family: Helvetica, sans-serif; box-sizing: border-box; padding: 5px;">
    <div style="text-align: center; background-color: #123; padding: 10px; margin-bottom: 30px;">
      <h1 style="margin: 0; color: #fff;">${companyName}</h1>
    </div>
    <div style="margin-bottom: 40px;">
      <h2 style="font-size: 1.75rem">Order #${orderNumber} Status Update</h2>
      <p>Hello ${customerName},</p>
      <p>Your order's status has been changed to <strong>${
        status.status
      }</strong>. Please let us know if you have any questions and thanks again for choosing ${companyName}.</p>`;

  if (status.tracking.length) {
    html += `<b>Tracking Number(s):</b><div style="margin-bottom: 20px">`;
    status.tracking.forEach(num => (html += `<div>${num}</div>`));
    html += "</div>";
  }

  if (status.comment) {
    html += `<b>Comments:</b><div>${status.comment}</div>`;
  }

  html += `</div></div>`;

  return html;
}

function createStatusEmailText(status, companyName, customerName, orderNumber) {
  let text = `${companyName}\n
Order #${orderNumber} Status Update\n
Hello ${customerName},\n
Your order's status has been changed to *${
    status.status
  }*. Please let us know if you have any questions and thanks again for choosing ${companyName}.\n\n`;
  if (status.tracking.length) {
    text += "Tracking Number(s):\n";
    status.tracking.forEach(num => (text += num + "\n"));
    text += "\n";
  }
  if (status.comment) {
    text += status.comment;
  }
  return text;
}

module.exports = {
  formatDate,
  createConfirmationEmailHTML,
  createConfirmationEmailText,
  createStatusEmailHTML,
  createStatusEmailText
};
