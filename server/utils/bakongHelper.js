import crypto from "crypto";

// KHQR Helper Functions - Based on actual Bakong KHQR standard
const generateTLV = (tag, value) => {
  const length = value.length.toString().padStart(2, "0");
  return `${tag}${length}${value}`;
};

const calculateCRC = (data) => {
  // CRC-16 CCITT calculation for KHQR
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
};

// Generate KHQR using correct Bakong KHQR standard
export const generateBakongKHQR = async (
  amount,
  orderId,
  merchantAccount,
  merchantName,
  merchantCity
) => {
  try {
    const billNumber = `ORD${orderId.slice(-8)}`;
    const timestamp = Date.now().toString();
    
    // Convert amount to USD with proper formatting
    const usdAmount = parseFloat(amount).toFixed(2);

    // EMV QR Code Data Objects for Bakong KHQR
    let qrData = "";

    // 00: Payload Format Indicator
    qrData += generateTLV("00", "01");

    // 01: Point of Initiation Method (12 = dynamic QR)
    qrData += generateTLV("01", "12");

    // 29: Merchant Account Information (Bakong specific)
    let merchantInfo = "";
    merchantInfo += generateTLV("00", "kh.gov.nbc.bakong"); // Bakong identifier
    merchantInfo += generateTLV("01", merchantAccount); // Your receiving account
    qrData += generateTLV("29", merchantInfo);

    // 52: Merchant Category Code
    qrData += generateTLV("52", "5732"); // Electronics stores

    // 53: Transaction Currency (840 = USD)
    qrData += generateTLV("53", "840");

    // 54: Transaction Amount
    qrData += generateTLV("54", usdAmount);

    // 58: Country Code
    qrData += generateTLV("58", "KH");

    // 59: Merchant Name
    qrData += generateTLV("59", merchantName.substring(0, 25));

    // 60: Merchant City
    qrData += generateTLV("60", merchantCity.substring(0, 15));

    // 62: Additional Data Field Template
    let additionalData = "";
    additionalData += generateTLV("01", billNumber); // Bill Number
    additionalData += generateTLV("02", "GINPC"); // Store Label
    qrData += generateTLV("62", additionalData);

    // 63: CRC (must be calculated last)
    const dataForCRC = qrData + "6304";
    const crc = calculateCRC(dataForCRC);
    qrData += generateTLV("63", crc);

    // Generate MD5 hash for transaction tracking
    const transactionRef = `${merchantAccount}_${usdAmount}_${billNumber}_${timestamp}`;
    const md5Hash = crypto.createHash("md5").update(transactionRef).digest("hex");

    console.log("Generated KHQR locally:", {
      qrString: qrData,
      length: qrData.length,
      md5Hash,
      billNumber,
      amount: usdAmount
    });

    return {
      qrString: qrData,
      md5Hash,
      billNumber,
      qrData: {
        merchantAccount,
        amount: usdAmount,
        currency: "USD",
        billNumber,
        merchantName,
        merchantCity,
      },
    };
  } catch (error) {
    console.error("KHQR Generation Error:", error);
    throw new Error("Failed to generate KHQR: " + error.message);
  }
};

// Check payment status using Bakong API
export const checkBakongPayment = async (md5Hash) => {
  try {
    console.log("Checking payment with MD5:", md5Hash);
    
    const response = await fetch(
      `${process.env.BAKONG_BASE_URL}/v1/check_transaction_by_md5`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.BAKONG_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          md5: md5Hash,
        }),
      }
    );

    const result = await response.json();
    console.log("Bakong Payment Check Response:", { 
      status: response.status, 
      result 
    });

    if (response.ok) {
      // Map Bakong response status
      const status = result.responseCode || result.status;
      switch (status) {
        case "0":
        case "00":
        case "SUCCESS":
        case "PAID":
          return { status: "paid", data: result };
        case "1":
        case "01":
        case "FAILED":
        case "DECLINED":
          return { status: "failed", data: result };
        case "2":
        case "02":
        case "EXPIRED":
        case "TIMEOUT":
          return { status: "expired", data: result };
        default:
          return { status: "pending", data: result };
      }
    } else {
      console.log("Payment check returned non-OK status:", response.status);
      return { status: "pending", data: result };
    }
  } catch (error) {
    console.error("Payment check error:", error);
    return { status: "pending", error: error.message };
  }
};