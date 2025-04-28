import React from 'react';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import { QRCodeSVG } from 'qrcode.react';

interface ReceiptProps {
  data: {
    orderId: string;
    customerName: string;
    items: Array<{
      productName: string;
      quantity: number;
      price: number;
      subtotal: number;
    }>;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    paymentMethod: string;
    createdAt: string;
    businessInfo: {
      name: string;
      address: string;
      phone: string;
      email: string;
    };
    qrCodeData: string;
  };
}

const Receipt: React.FC<ReceiptProps> = ({ data }) => {
  return (
    <div className="bg-white font-mono text-sm leading-tight">
      {/* Logo/Header */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">{data.businessInfo.name}</h1>
        <p className="text-xs">{data.businessInfo.address}</p>
        <p className="text-xs">Tel: {data.businessInfo.phone}</p>
        <p className="text-xs">{data.businessInfo.email}</p>
        <div className="border-b border-gray-300 my-3"></div>
      </div>

      {/* Receipt Info */}
      <div className="mb-3">
        <div className="flex justify-between">
          <span>Order #:</span>
          <span>{data.orderId}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{formatDate(data.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>Time:</span>
          <span>{formatTime(data.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>Customer:</span>
          <span>{data.customerName}</span>
        </div>
        <div className="border-b border-gray-300 my-3"></div>
      </div>

      {/* Items */}
      <div className="mb-3">
        <div className="grid grid-cols-12 font-bold mb-1">
          <div className="col-span-6">Item</div>
          <div className="col-span-2 text-right">Qty</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Total</div>
        </div>
        <div className="border-b border-gray-300 mb-2"></div>
        
        {data.items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 mb-1">
            <div className="col-span-6 truncate">{item.productName}</div>
            <div className="col-span-2 text-right">{item.quantity}</div>
            <div className="col-span-2 text-right">${item.price.toFixed(2)}</div>
            <div className="col-span-2 text-right">${item.subtotal.toFixed(2)}</div>
          </div>
        ))}
        
        <div className="border-b border-gray-300 my-2"></div>
      </div>

      {/* Totals */}
      <div className="mb-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(data.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>{formatCurrency(data.tax)}</span>
        </div>
        {data.discount > 0 && (
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>-{formatCurrency(data.discount)}</span>
          </div>
        )}
        <div className="border-b border-gray-300 my-2"></div>
        <div className="flex justify-between font-bold">
          <span>TOTAL:</span>
          <span>{formatCurrency(data.total)}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span>Payment Method:</span>
          <span className="capitalize">{data.paymentMethod}</span>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-3">
        <QRCodeSVG value={data.qrCodeData} size={120} />
      </div>

      {/* Footer */}
      <div className="text-center text-xs">
        <p>Scan QR code for digital receipt</p>
        <p className="mt-2">Thank you for your business!</p>
        <p>Please come again</p>
      </div>
    </div>
  );
};

export default Receipt;