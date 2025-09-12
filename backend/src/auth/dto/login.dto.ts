import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Inserisci un indirizzo email valido' })
  @IsNotEmpty({ message: 'L\'email è obbligatoria' })
  email: string;

  @IsString({ message: 'La password deve essere una stringa' })
  @IsNotEmpty({ message: 'La password è obbligatoria' })
  password: string;
}