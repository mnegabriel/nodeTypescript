import { getRepository } from 'typeorm';

import User from '../models/Users';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User); // Cria um repositório de users

    // só é necessário criar um arquivo de repositório caso hajam funções
    // novas não nativas necessarias para a aplicação

    const checkUserExists = await userRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new Error('Email already in use.');
    }

    const user = userRepository.create({
      name,
      email,
      password,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;
