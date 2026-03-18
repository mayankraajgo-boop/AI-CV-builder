import mongoose, { Document, Schema } from 'mongoose';

export interface IPersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface IExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface IProject {
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  personalInfo: IPersonalInfo;
  skills: string[];
  experience: IExperience[];
  education: IEducation[];
  projects: IProject[];
  templateId: string;
  atsScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, default: 'Untitled Resume' },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
      summary: { type: String, default: '' },
    },
    skills: [{ type: String }],
    experience: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        current: { type: Boolean, default: false },
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: String,
        endDate: String,
        gpa: String,
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        technologies: String,
        link: String,
      },
    ],
    templateId: { type: String, default: 'modern' },
    atsScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IResume>('Resume', ResumeSchema);
