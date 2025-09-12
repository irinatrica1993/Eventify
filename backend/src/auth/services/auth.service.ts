import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';
import mongoose from 'mongoose';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UserDto } from '../../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: UserDto; token: string }> {
    // Verifica se l'utente esiste già
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new UnauthorizedException('Email già registrata');
    }

    // Crea un nuovo utente
    const newUser = new this.userModel(registerDto);
    const savedUser = await newUser.save();

    // Genera il token JWT
    const token = this.generateToken(savedUser);

    // Restituisci l'utente e il token
    return {
      user: this.createUserDto(savedUser),
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: UserDto; token: string }> {
    // Trova l'utente per email
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Credenziali non valide');
    }

    // Verifica la password
    const isPasswordValid = await user.comparePassword(loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenziali non valide');
    }

    // Genera il token JWT
    const token = this.generateToken(user);

    // Restituisci l'utente e il token
    return {
      user: this.createUserDto(user),
      token,
    };
  }

  private generateToken(user: any): string {
    // Costruisci il payload del token
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    // Genera e restituisci il token
    return this.jwtService.sign(payload);
  }

  private createUserDto(user: any): UserDto {
    return new UserDto({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
  async findOrCreateGoogleUser(googleUser: any): Promise<{ user: UserDto; token: string }> {
  // Cerca l'utente per email o googleId
  let user = await this.userModel.findOne({
    $or: [{ email: googleUser.email }, { googleId: googleUser.googleId }],
  });

  // Se l'utente non esiste, crealo
  if (!user) {
    const newUser = new this.userModel({
      email: googleUser.email,
      name: googleUser.name,
      googleId: googleUser.googleId,
      // Genera una password casuale per gli utenti Google
      password: Math.random().toString(36).slice(-8),
    });
    user = await newUser.save();
  } else if (!user.googleId) {
    // Se l'utente esiste ma non ha un googleId, aggiornalo
    user.googleId = googleUser.googleId;
    await user.save();
  }

  // Genera il token JWT
  const token = this.generateToken(user);

  // Restituisci l'utente e il token
  return {
    user: this.createUserDto(user),
    token,
  };
}
}