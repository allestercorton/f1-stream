import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

class Session {
  @prop({ type: String, required: true })
  public name!: string;

  @prop({ type: Date, required: true })
  public startTime!: Date;

  @prop({ type: Date, required: true })
  public endTime!: Date;
}

@modelOptions({ schemaOptions: { collection: 'races', timestamps: true } })
export class Race {
  @prop({ type: String, required: true })
  public grandPrix!: string;

  @prop({ type: String, required: true })
  public circuit!: string;

  @prop({ type: String, required: true })
  public country!: string;

  @prop({ type: () => [Session], _id: false })
  public sessions!: Session[];

  @prop({ type: Boolean, default: false })
  public hasSprint?: boolean;
}

export const RaceModel = getModelForClass(Race);
