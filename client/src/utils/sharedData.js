// Shared data management between user and worker portals
const STORAGE_KEYS = {
  ORDERS: 'mahaplants_orders',
  SERVICES: 'mahaplants_services'
};

// Order management
export const saveOrder = (order) => {
  const orders = getOrders();
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 1); // Next day delivery
  
  const newOrder = {
    ...order,
    id: order.id || Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    services: [
      {
        id: Date.now().toString() + '_delivery',
        orderId: order.id || Date.now().toString(),
        type: 'delivery',
        title: 'Plant Delivery & Setup',
        description: 'Initial delivery and setup of your plants',
        status: 'scheduled',
        scheduledDate: deliveryDate.toISOString(),
        scheduledTime: '10:00 AM',
        workerName: 'To be assigned',
        createdAt: new Date().toISOString(),
        workerUpdates: []
      }
    ]
  };
  orders.push(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  return newOrder;
};

export const getOrders = () => {
  const orders = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return orders ? JSON.parse(orders) : [];
};

export const getOrderById = (orderId) => {
  const orders = getOrders();
  return orders.find(order => order.id === orderId);
};

// Service management
export const addServiceToOrder = (orderId, service) => {
  const orders = getOrders();
  console.log('Looking for order:', orderId);
  console.log('Available orders:', orders);
  
  let orderIndex = orders.findIndex(order => order.id === orderId);
  
  // If order not found, create a mock order
  if (orderIndex === -1) {
    console.log('Order not found, creating mock order');
    const mockOrder = {
      id: orderId,
      orderNumber: `ORD${orderId.slice(-6)}`,
      customerName: 'Customer',
      items: [{ name: 'Plant' }],
      shippingAddress: { address: 'Customer Address' },
      services: []
    };
    orders.push(mockOrder);
    orderIndex = orders.length - 1;
  }
  
  // Only allow maintenance services to be scheduled
  if (service.type === 'delivery') {
    console.log('Delivery service blocked - auto-created only');
    return null;
  }
  
  const newService = {
    ...service,
    id: Date.now().toString(),
    orderId,
    createdAt: new Date().toISOString(),
    status: 'scheduled',
    workerUpdates: []
  };
  
  if (!orders[orderIndex].services) {
    orders[orderIndex].services = [];
  }
  
  orders[orderIndex].services.push(newService);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  
  console.log('Service added successfully:', newService);
  console.log('Updated order:', orders[orderIndex]);
  
  return newService;
};

export const updateServiceStatus = (orderId, serviceId, updates) => {
  const orders = getOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex !== -1) {
    const serviceIndex = orders[orderIndex].services.findIndex(service => service.id === serviceId);
    
    if (serviceIndex !== -1) {
      orders[orderIndex].services[serviceIndex] = {
        ...orders[orderIndex].services[serviceIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return orders[orderIndex].services[serviceIndex];
    }
  }
  return null;
};

export const confirmServiceByCustomer = (orderId, serviceId) => {
  return updateServiceStatus(orderId, serviceId, {
    customerConfirmed: true,
    confirmationDate: new Date().toISOString(),
    status: 'completed'
  });
};

// Get all services for worker portal
export const getAllServices = () => {
  const orders = getOrders();
  const allServices = [];
  
  orders.forEach(order => {
    order.services.forEach(service => {
      allServices.push({
        ...service,
        customerName: order.customerName || 'Customer',
        customerAddress: order.shippingAddress?.address || 'Address not provided',
        orderNumber: order.orderNumber || order.id,
        plants: order.items?.map(item => item.name) || ['Plants']
      });
    });
  });
  
  return allServices;
};

// Worker updates service
export const workerUpdateService = (serviceId, updates) => {
  const orders = getOrders();
  
  for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) {
    const serviceIndex = orders[orderIndex].services.findIndex(service => service.id === serviceId);
    
    if (serviceIndex !== -1) {
      const service = orders[orderIndex].services[serviceIndex];
      
      // Add worker update to history
      if (!service.workerUpdates) {
        service.workerUpdates = [];
      }
      
      service.workerUpdates.push({
        ...updates,
        timestamp: new Date().toISOString(),
        workerName: 'Worker Team'
      });
      
      // Update service status
      orders[orderIndex].services[serviceIndex] = {
        ...service,
        status: updates.status || service.status,
        lastWorkerUpdate: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return orders[orderIndex].services[serviceIndex];
    }
  }
  
  return null;
};