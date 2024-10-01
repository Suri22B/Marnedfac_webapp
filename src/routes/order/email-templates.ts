// Function to generate email template for the user
export function generateUserEmailTemplate(orders: any[]) {
  const orderRows = orders
    .map(
      (order) => `
    <tr>
      <td>${order.orderedMenu.name}</td>
      <td>${order.quantity}</td>
      <td>${order.defac.name}</td>
      <td>${order.pickupTime}</td>
    </tr>`,
    )
    .join('');

  return `
    <h2>Order Confirmation</h2>
    <p>Thank you for your order! Here are the details:</p>
    <table border="1" cellpadding="10">
      <thead>
        <tr>
          <th>Menu Item</th>
          <th>Quantity</th>
          <th>DEFAC</th>
          <th>Pickup Time</th>
        </tr>
      </thead>
      <tbody>
        ${orderRows}
      </tbody>
    </table>
  `;
}

export function generateUserOrderEmailTemplate(orders: any[]) {
  return `
    <h2>Order Completion</h2>
    <p>Your order has been successfully completed!</p>
    <p>Thank you for choosing our service!</p>
  `;
}

// Function to generate email template for the DEFAC
export function generateDefacEmailTemplate(orders: any[]) {
  const orderRows = orders
    .map(
      (order) => `
    <tr>
      <td>${order.orderedMenu.name}</td>
      <td>${order.quantity}</td>
      <td>${order.orderedBy.name}</td>
      <td>${order.pickupTime}</td>
    </tr>`,
    )
    .join('');

  return `
    <h2>New Order Received</h2>
    <p>You have received a new order. Here are the details:</p>
    <table border="1" cellpadding="10">
      <thead>
        <tr>
          <th>Menu Item</th>
          <th>Quantity</th>
          <th>Ordered By</th>
          <th>Pickup Time</th>
        </tr>
      </thead>
      <tbody>
        ${orderRows}
      </tbody>
    </table>
  `;
}
