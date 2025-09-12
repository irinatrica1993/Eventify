import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Inserisci un indirizzo email valido' })
  @IsNotEmpty({ message: 'L\'email è obbligatoria' })
  email: string;

  @IsString({ message: 'La password deve essere una stringa' })
  @MinLength(6, { message: 'La password deve contenere almeno 6 caratteri' })
  @IsNotEmpty({ message: 'La password è obbligatoria' })
  password: string;

  @IsString({ message: 'Il nome deve essere una stringa' })
  @IsNotEmpty({ message: 'Il nome è obbligatorio' })
  name: string;
}