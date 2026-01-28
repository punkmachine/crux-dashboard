import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Site } from "./Site.js";

@Entity("metrics")
export class Metric {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  siteId!: string;

  @Column({ type: "date" })
  createCollectionDate!: Date;

  @Column({ type: "date" })
  collectionPeriodStart!: Date;

  @Column({ type: "date" })
  collectionPeriodEnd!: Date;

  @Column({ type: "jsonb" })
  cruxData!: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Site, (site) => site.metrics, { onDelete: "CASCADE" })
  @JoinColumn({ name: "siteId" })
  site!: Site;
}
