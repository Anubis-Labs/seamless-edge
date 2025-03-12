import React, { useState } from 'react';

// Placeholder for Stripe - would need actual Stripe integration in production
const StripePaymentForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <label htmlFor="cardName" className="block text-sm font-medium text-accent-navy mb-1">
          Name on Card
        </label>
        <input
          id="cardName"
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:ring-accent-forest focus:border-accent-forest"
          placeholder="Full name as displayed on card"
          required
        />
      </div>
      
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-accent-navy mb-1">
          Card Number
        </label>
        <input
          id="cardNumber"
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:ring-accent-forest focus:border-accent-forest"
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiry" className="block text-sm font-medium text-accent-navy mb-1">
            Expiration Date
          </label>
          <input
            id="expiry"
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-accent-forest focus:border-accent-forest"
            placeholder="MM/YY"
            maxLength={5}
            required
          />
        </div>
        <div>
          <label htmlFor="cvc" className="block text-sm font-medium text-accent-navy mb-1">
            CVC
          </label>
          <input
            id="cvc"
            type="text"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-accent-forest focus:border-accent-forest"
            placeholder="123"
            maxLength={3}
            required
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isProcessing}
        className={`w-full py-3 px-4 mt-6 text-white font-medium rounded shadow-sm 
        ${isProcessing ? 'bg-gray-400' : 'bg-accent-forest hover:bg-accent-navy'} 
        transition-colors duration-300`}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

// ID Verification component
const IDVerification: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload and verification
    setTimeout(() => {
      setIsUploading(false);
      onComplete();
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div>
        <label htmlFor="idFile" className="block text-sm font-medium text-accent-navy mb-1">
          Upload Government-Issued ID
        </label>
        <p className="text-sm text-accent-navy/60 mb-3">
          Please upload a clear image of your driver's license, passport, or other government-issued ID
        </p>
        <input
          id="idFile"
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setIdFile(e.target.files[0])}
          className="w-full p-2 border border-gray-300 rounded focus:ring-accent-forest focus:border-accent-forest"
          required
        />
      </div>
      
      <div>
        <label htmlFor="selfieFile" className="block text-sm font-medium text-accent-navy mb-1">
          Upload Selfie with ID
        </label>
        <p className="text-sm text-accent-navy/60 mb-3">
          Please upload a clear photo of yourself holding your ID for verification
        </p>
        <input
          id="selfieFile"
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setSelfieFile(e.target.files[0])}
          className="w-full p-2 border border-gray-300 rounded focus:ring-accent-forest focus:border-accent-forest"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isUploading || !idFile || !selfieFile}
        className={`w-full py-3 px-4 mt-4 text-white font-medium rounded shadow-sm 
        ${isUploading || !idFile || !selfieFile ? 'bg-gray-400' : 'bg-accent-forest hover:bg-accent-navy'} 
        transition-colors duration-300`}
      >
        {isUploading ? 'Uploading...' : 'Verify Identity'}
      </button>
    </form>
  );
};

const PaymentsPage: React.FC = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  const handleStepOne = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveStep(2);
  };

  const handleIdentityVerified = () => {
    setActiveStep(3);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentComplete(true);
  };

  return (
    <div className="w-full py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-semibold text-accent-navy mb-4">
            Secure Client Payments
          </h1>
          <div className="w-16 h-px bg-accent-forest mx-auto mb-6"></div>
          <p className="text-lg text-accent-navy/70 font-body">
            Make a secure payment for your drywall services with our encrypted payment system.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-12 w-full max-w-md mx-auto">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${step < activeStep ? 'bg-accent-forest text-white' : 
                  step === activeStep ? 'bg-white border-2 border-accent-forest text-accent-forest' : 
                  'bg-gray-200 text-gray-500'}`}
              >
                {step < activeStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span className={`text-xs mt-2 font-medium ${step <= activeStep ? 'text-accent-navy' : 'text-gray-500'}`}>
                {step === 1 ? 'Invoice Details' : step === 2 ? 'Verify Identity' : 'Payment'}
              </span>
            </div>
          ))}
        </div>

        {isPaymentComplete ? (
          <div className="text-center py-10 bg-neutral-offwhite rounded-lg">
            <div className="w-16 h-16 bg-accent-forest rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-heading font-semibold text-accent-navy mb-4">Payment Successful!</h2>
            <p className="text-accent-navy/70 mb-8">
              Thank you for your payment. A receipt has been sent to your email address.
            </p>
            <a 
              href="/"
              className="inline-flex items-center text-accent-navy hover:text-accent-forest transition-all duration-300 font-heading font-medium"
            >
              <span className="mr-2">Return to Home</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        ) : (
          <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              {activeStep === 1 && (
                <div>
                  <h2 className="text-xl font-heading font-semibold text-accent-navy mb-6">Enter Invoice Details</h2>
                  <form onSubmit={handleStepOne} className="space-y-4">
                    <div>
                      <label htmlFor="invoiceNumber" className="block text-sm font-medium text-accent-navy mb-1">
                        Invoice Number
                      </label>
                      <input
                        id="invoiceNumber"
                        type="text"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-accent-forest focus:border-accent-forest"
                        placeholder="e.g., INV-2023-1234"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-accent-navy mb-1">
                        Amount Due (CAD)
                      </label>
                      <input
                        id="amount"
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-accent-forest focus:border-accent-forest"
                        placeholder="e.g., 1250.00"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-3 px-4 mt-6 bg-accent-forest text-white font-medium rounded shadow-sm hover:bg-accent-navy transition-colors duration-300"
                    >
                      Continue
                    </button>
                  </form>
                </div>
              )}
              
              {activeStep === 2 && (
                <div>
                  <h2 className="text-xl font-heading font-semibold text-accent-navy mb-6">Verify Your Identity</h2>
                  <p className="text-accent-navy/70 mb-6">
                    For your security and to prevent fraud, we require identity verification before processing your payment.
                  </p>
                  <IDVerification onComplete={handleIdentityVerified} />
                </div>
              )}
              
              {activeStep === 3 && (
                <div>
                  <h2 className="text-xl font-heading font-semibold text-accent-navy mb-6">Make Your Payment</h2>
                  <div className="bg-neutral-offwhite p-4 rounded mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-accent-navy/70">Invoice:</span>
                      <span className="font-medium">{invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-accent-navy/70">Amount Due:</span>
                      <span className="text-xl font-semibold text-accent-navy">${amount} CAD</span>
                    </div>
                  </div>
                  <StripePaymentForm onSuccess={handlePaymentSuccess} />
                </div>
              )}
            </div>
            
            <div className="bg-neutral-offwhite/50 p-4 border-t border-gray-100">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-forest mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-accent-navy/70">
                  All information is encrypted and securely processed
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage; 