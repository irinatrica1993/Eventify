

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../enums/user-role.enum';

export interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  googleId?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

@Schema({
  timestamps: true, // Aggiunge automaticamente createdAt e updatedAt
})
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ required: false })
  googleId?: string;

}

export const UserSchema = SchemaFactory.createForClass(User);

// Aggiungi il metodo comparePassword allo schema
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Hook pre-save per hashare la password
UserSchema.pre('save', async function(this: UserDocument, next) {
  // Esegui l'hash solo se la password è stata modificata
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});