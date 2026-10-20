import PageContext from "@/app/providers/pagecontext";
import { useContext } from "react";

export const PersonalInformation = () => {
    const { i18 } = useContext(PageContext);
    return {
        para: i18?.NEW?.INFORMATION || 'Keep your profile up to date for a smoother and safer delivery experience.',
        list: [
            '✅ Make sure your name, email, and phone number are accurate — we use them to send delivery updates and verification messages.',
            '📍 Updating your address helps Postiers calculate routes and find you faster.',
            '🔒 Your information is private and protected under GDPR. We never share it without your consent.'
        ],
        footer1: 'Need to change your login email? Please contact support@postier.org for support.',
        footer2: '👉 Don’t forget to save your changes!'

    }
}

export const VerifyDocuments = () => {
    const { i18 } = useContext(PageContext);
    return {
        para: i18?.NEW?.DOCUMENTS || 'To ensure safety and build trust on the platform, we require verified documents from all Postiers.',
        list: [
            "📄 A valid government-issued ID (e.g., passport, national ID card, driver's license)",
            "🏠 A recent proof of address (e.g., utility bill, bank statement, rental contract — issued within the last 3 months)",
            "✅ Your documents are encrypted and securely stored."
        ],
        footer1: '🔒 We comply with GDPR and use your data only for identity and safety verification.Need help? Reach us anytime at info@postier.org.',
        footer2: '👉 Make sure the documents are clear and readable. Only verified Postiers can accept and deliver parcels.'

    }
}


export const PaymentInformation = () => {
    const { i18 } = useContext(PageContext);
    return {
        para: i18?.NEW?.PAYOUTS || 'We make sure your transactions are secure, transparent, and easy to track.',
        list: [
            '✅ You can pay using credit/debit cards, PayPal, or other local payment options.',
            '💡 Your payment is held securely and only released to the Postier after delivery is confirmed.',
            '🔐 All transactions are encrypted and processed through trusted providers.',
            '💸 Payouts (for Postiers):',
            '🏁 You’ll receive your payout 24 hours after the delivery is confirmed by the receiver.',
            '🏦 Payouts can be made to your bank account, PayPal, or mobile wallet, depending on your location.',
            '📑 Make sure your payout details are correct and verified to avoid delay.'
        ],
        footer1: 'Need help? Contact payment@postier.org or visit our Payment Help Center.'
    };
}

export const NotificationPreferences = () => {
    const { i18 } = useContext(PageContext);
    return {
        para: i18?.NEW?.NEW_NOTIFICATIONS || 'Stay informed every step of the way.',
        list: [
            '📦 Delivery Updates: Get real-time alerts for parcel pickup, in-transit status, and delivery confirmation.',
            '👥 Messages & Chat: Be notified when someone contacts you regarding a delivery.',
            '💳 Payments & Payouts: Receive confirmations for successful payments and completed payouts.',
            '🛡️ Security & Account Alerts: Get notified of login attempts, verification steps, and document approvals.',
            '🌍 Language Support: Notifications are automatically translated based on your preferred language settings.',
            '📱 You can receive notifications via email, SMS, and in-app alerts.'
        ],
        footer1: '⚙️ Manage your preferences anytime in your profile settings.'
    };
}

export const ReviewGuidelines = () => {
    const { i18 } = useContext(PageContext);
    return {
        para: i18?.NEW?.REVIEWS || 'Your feedback helps build a safer, more reliable delivery community.',
        list: [
            '✅ Rate your experience after each delivery as a sender, receiver, or Postier.',
            '📝 Leave a review to highlight what went well — or to share constructive feedback.',
            '🛡️ All reviews are verified and only available to users who completed a delivery.',
            '📣 Reviews contribute to a user’s profile rating and help others choose trustworthy partners.'
        ],
        footer1: '💡 Be respectful, clear, and fair — your voice shapes the quality of our community.',
        footer2: '🔒 Reviews are moderated to ensure they meet our community guidelines and respect our Code of Conduct.'
    };
}

export const SupportInformation = () => {
    const { i18 } = useContext(PageContext);
    return {
        para: i18?.NEW?.HELP || 'We’re here to support you at every step.',
        list: [
            '🔍 Find quick answers to common questions about deliveries, payments, account settings, and more.',
            '📚 Browse by topic to get guidance tailored to senders, receivers, and Postiers (travellers).',
            '💬 Contact support directly if you need personalized assistance — we’re just an email or message away.',
            '🌍 Multilingual support available for users from Germany, France, Cameroon, Belgium, Hungary, and more.'
        ],
        footer1: '🚀 Visit the Help Center anytime from your dashboard or at postier.org/help'
    };
}

export const DateofBirth = () => {
    const { i18 } = useContext(PageContext);
    return {
        heading: "Why we need your Date of Birth",
        para: i18?.NEW?.DOB || 'We ask for your date of birth to:',
        list: [
            'Verify your identity: To ensure that your account is secure and to comply with age-related policies.',
            'Personalize your experience: To tailor recommendations, offers, and services based on your profile.',
            'Comply with legal requirements: Some services or features may require age verification.',
        ],
        footer1: 'Your information will always be kept secure and used only for these purposes.'
    };
}

export const PhoneNumber = () => {
    const { i18 } = useContext(PageContext);
    return {
        para: i18?.NEW?.PHONENUMBER || 'We collect your phone number for the following reasons:',
        list: [
            'Account Security: To send you important verification codes, including OTPs (One-Time Passwords) to keep your account secure.',
            'Order Updates: To notify you about parcel pickup, delivery status, or any changes related to your trips and parcels.',
            'Emergency contact: To reach you quickly in case there are issues or important updates regarding your deliveries or trips.',
        ],
        footer1: 'Your phone number will be kept private and will only be used for these purposes.'
    };
}

export const VerifyContent = () => {
    const { i18 } = useContext(PageContext);
    return {
        para: i18?.NEW?.VERIFYCONTENT ||  'Check your inbox and enter the OTP code we just sent to your phone to complete the verification.',
    };
}

export const VerifyEmail = () => {
    const { i18 } = useContext(PageContext);
    return {
        para: i18?.NEW?.VERIFYEMAIL ||  'Check your email address and enter the OTP code we just sent to your email to complete the verification.',
    };
}

export const VehicleContent = () => {
    const { i18 } = useContext(PageContext);
    return {
        para: i18?.NEW?.VEHICLE ||  'Add your vehicle details to get started with your journey.',
    };
}

export const CounterOfferContent = () => {
    const { i18 } = useContext(PageContext);
    return {
        para: i18?.NEW?.COUNTERCONTENT ||  "You can counter the offered price if you believe it doesn't align with the value of the delivery or your costs. To do so, simply enter your preferred price and submit your counter offer. The Postier will review it, and if they accept, you'll be notified. Negotiation helps you get a fair deal!"
    };
}

export const DeliveryTypeContent = () => {
    const { i18 } = useContext(PageContext);
    return {
        headImg: "/png/vanpng.png",
        heading:i18?.NEW?.DELIVERTHEADING || 'Choose Your Delivery Type',
        para: i18?.NEW?.DELIVERYCONTENT ||  "Select the delivery type that best fits your needs. Whether you need Standard Delivery for a cost-effective solution, or Express Delivery for faster service, Postier has you covered. You can also choose a Scheduled Delivery to set a specific date and time for parcel arrival. Choose wisely to ensure the best experience for your parcel and recipient!"
    };
}

export const ParcelContent = () => {
    const { i18 } = useContext(PageContext);
    return {
        heading: i18?.NEW?.PARCELCONTENT ||  "📦 Select the Parcel Type - Ensure Legal Compliance",
        para: 'When choosing the type of parcel, please ensure it complies with local laws and regulations. Avoid shipping prohibited items like hazardous materials, illegal substances, or valuables that require special handling. Postier is committed to safe and legal delivery, so please make sure your parcel type aligns with safety guidelines and shipping restrictions. For further details on prohibited items, refer to our Terms and Conditions.'
    };
}

export const PriceContent = () => {
    const { i18 } = useContext(PageContext);
    return {
        sm: true,
        headImg: "/png/coinblue.png",
        heading: i18?.NEW?.PRICECONTENT ||  "Average Price Calculation",
        para: 'The average delivery price is based on a few key factors:',
        list:["Distance between pickup and drop-off points", "Parcel size & weight, using volumetric weight (Length × Width × Height ÷ 5000)", "Parcel size & weight, using volumetric weight (Length × Width × Height ÷ 5000)", "Delivery type – standard, express, or special handling", "Applicable discounts for long distances or light items"],
        footer1: "Our smart estimator combines these variables using real-world data to offer a fair and transparent price to both sender and Postier.",
        footer2Img: "/svg/icon/package2.svg",
        footer2: "Want a better rate? Consider flexible dates, compact packaging, or standard delivery."
    };
}

export const UploadParcelContent = () => {
    const { i18 } = useContext(PageContext);
    return {
        heading: i18?.NEW?.UPLOADCONTENT ||  "📸 Upload Parcel Pictures for Extra Protection",
        para: "Before you publish your parcel, we recommend uploading clear photos of the parcel from different angles. This will help us resolve any potential disputes and ensure your parcel is shipped with care. It's an important step to protect both you and the recipient, giving us a visual record of the parcel’s condition before shipping."
    };
}

export const NameContent = () => {
    const { i18 } = useContext(PageContext);
    return {
        para: i18?.NEW?.NAMECONTENT || 'To personalize your experience and ensure smooth communication, we need your full name.',
        fname: 'First Name: Your given name.',
        lname: 'Last Name: Your family or surname.',
        footer1: 'This information will help us serve you better and provide accurate delivery and account-related updates.'
    };
}

export const DeleteContent = () => {
    const { i18 } = useContext(PageContext);
    return {
        heading: '🗑️ Delete Account',
        para: i18?.NEW?.DELETECONTENT || 'You can request to delete your account at any time — no questions asked.',
        list: [
            '✅ Your account can be deleted if there are no active or pending deliveries associated with it.',
            '⏳ If you have an ongoing delivery, deletion will be available after the delivery is completed and all related payments are processed.',
            '🔒 All personal data will be securely removed or anonymized in accordance with our Privacy Policy and applicable data protection laws.',
            '📄 Certain data (e.g., invoices or transaction history) may be retained temporarily to meet legal or tax obligations.',
                    ],
        footer1: "📬 If you're having trouble or need help before deleting, contact our support team at support@postier.org"
    };
}