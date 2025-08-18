import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Conta } from 'src/conta/conta.entity';
import { Categoria } from 'src/categoria/categoria.entity';

export enum TipoTransacao {
    ENTRADA = 'entrada',
    SAIDA = 'saída'
}

@Entity('transacoes')
export class Transacao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, default: null, nullable: true })
    descricao?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    valor: number;

    @Column({ type: 'enum', enum: TipoTransacao })
    tipo: TipoTransacao;

    @Column({ type: 'date' })
    data: Date;

    @ManyToOne(() => Conta, conta => conta.transacoes)
    @JoinColumn({ name: 'conta_id' })
    conta: Conta;

    @ManyToOne(() => Categoria, categoria => categoria.transacoes)
    @JoinColumn({ name: 'categoria_id' })
    categoria: Categoria;

    @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date | null;
}