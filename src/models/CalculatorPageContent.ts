import mongoose, { Document, Schema } from "mongoose";

export interface ICalculatorFaqItem {
    question: string;
    answer: string;
}

export interface ICalculatorPageContent extends Document {
    slug: string;
    cardTitle: string;
    cardSubTitle: string;
    cardDescription: string;
    pageHeading: string;
    pageIntro: string;
    seoTitle: string;
    seoDescription: string;
    contentTitle: string;
    contentIntro: string;
    contentHtml: string;
    faqItems: ICalculatorFaqItem[];
    createdAt: Date;
    updatedAt: Date;
}

const CalculatorFaqItemSchema = new Schema<ICalculatorFaqItem>(
    {
        question: {
            type: String,
            default: "",
            trim: true,
        },
        answer: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const CalculatorPageContentSchema = new Schema<ICalculatorPageContent>(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        cardTitle: {
            type: String,
            default: "",
            trim: true,
        },
        cardSubTitle: {
            type: String,
            default: "",
            trim: true,
        },
        cardDescription: {
            type: String,
            default: "",
            trim: true,
        },
        pageHeading: {
            type: String,
            default: "",
            trim: true,
        },
        pageIntro: {
            type: String,
            default: "",
            trim: true,
        },
        seoTitle: {
            type: String,
            default: "",
            trim: true,
        },
        seoDescription: {
            type: String,
            default: "",
            trim: true,
        },
        contentTitle: {
            type: String,
            default: "",
            trim: true,
        },
        contentIntro: {
            type: String,
            default: "",
            trim: true,
        },
        contentHtml: {
            type: String,
            default: "",
        },
        faqItems: {
            type: [CalculatorFaqItemSchema],
            default: [],
        },
    },
    {
        collection: "calculator_page_content",
        timestamps: true,
    }
);

if (process.env.NODE_ENV !== "production" && mongoose.models.CalculatorPageContent) {
    mongoose.deleteModel("CalculatorPageContent");
}

const CalculatorPageContent =
    (mongoose.models.CalculatorPageContent as mongoose.Model<ICalculatorPageContent> | undefined) ||
    mongoose.model<ICalculatorPageContent>(
        "CalculatorPageContent",
        CalculatorPageContentSchema
    );

export default CalculatorPageContent;
