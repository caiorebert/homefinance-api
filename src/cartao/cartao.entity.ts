import { Conta } from 'src/conta/conta.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('cartao')
export class Cartao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    nome: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    limite: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    saldoUtilizado: number;

    @ManyToOne(() => Conta, conta => conta.cartoes, { eager: true })
    @JoinColumn({ name: 'conta_id' })
    conta: Conta;

    @Column({ default: true })
    ativo: boolean;

    @CreateDateColumn()
    criadoEm: Date;

    @UpdateDateColumn()
    atualizadoEm: Date;
}