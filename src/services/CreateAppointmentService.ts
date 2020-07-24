import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

// todo service executa apenas uma função

interface RequestDTO {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ date, provider }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const hourDate = startOfHour(date); // regra de negócio
    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      hourDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('Timeslot not available');
    }

    const appointment = appointmentsRepository.create({
      provider,
      date: hourDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}
export default CreateAppointmentService;
