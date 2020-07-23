import { startOfHour } from 'date-fns';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

// todo service executa apenas uma função

interface RequestDTO {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository: AppointmentsRepository;

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ date, provider }: RequestDTO): Appointment {
    const hourDate = startOfHour(date); // regra de negócio
    const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
      hourDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('Timeslot not available');
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: hourDate,
    });

    return appointment;
  }
}
export default CreateAppointmentService;
