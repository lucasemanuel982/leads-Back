import mongoose, { Document, Schema } from 'mongoose';

// Interface para o subdocumento de tracking
interface ITracking {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
}

// Interface para o subdocumento de submissão
interface ISubmissionInfo {
  ipAddress: string;
  userAgent?: string;
  referrer?: string;
  submittedAt: Date;
}

// Interface principal do Lead
export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  position: string;
  birthDate: Date;
  message?: string;
  tracking: ITracking;
  submissionInfo: ISubmissionInfo;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    // Dados do Formulário
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true,
      index: true 
    },
    phone: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    birthDate: { type: Date, required: true },
    message: { type: String, trim: true },
    
    // Tracking Automático
    tracking: {
      utmSource: { type: String, default: null },
      utmMedium: { type: String, default: null },
      utmCampaign: { type: String, default: null },
      utmTerm: { type: String, default: null },
      utmContent: { type: String, default: null },
      gclid: { type: String, default: null },
      fbclid: { type: String, default: null },
    },
    
    // Logs de Envio
    submissionInfo: {
      ipAddress: { type: String, required: true },
      userAgent: { type: String },
      referrer: { type: String },
      submittedAt: { type: Date, default: Date.now },
    },
    
    // Metadados
    isActive: { type: Boolean, default: true },
  },
  { 
    timestamps: true,
    collection: 'leads'
  }
);

// Índices adicionais para melhor performance
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ isActive: 1 });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);


