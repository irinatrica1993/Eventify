import { Body, Controller, Get, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Questo endpoint avvia il flusso di autenticazione Google
    // La logica è gestita da Passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    // Questo endpoint gestisce il callback di Google
    // req.user contiene l'utente autenticato e il token JWT
    const userData = req.user;
    
    // Reindirizza l'utente alla dashboard del frontend con i dati dell'utente e il token JWT
    // Utilizziamo un URL con parametri di query per passare i dati al frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    // Codifichiamo i dati dell'utente come parametro di query
    const userDataParam = encodeURIComponent(JSON.stringify(userData));
    
    // Reindirizza alla pagina di callback del frontend
    return res.redirect(`${frontendUrl}/auth/google/callback?data=${userDataParam}`);
  }
}
