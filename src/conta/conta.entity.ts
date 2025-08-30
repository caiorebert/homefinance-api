import { Cartao } from 'src/cartao/cartao.entity';
import { Transacao } from 'src/transacao/transacao.entity';
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn, OneToMany, DeleteDateColumn } from 'typeorm';

@Entity('conta')
export class Conta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    saldo: number;

    @Column({ length: 50 })
    tipo: string;

    @Column({ type: 'text', nullable: true })
    descricao?: string;

    @ManyToOne(() => User, user => user.contas)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Transacao, transacao => transacao.conta)
    transacoes: Transacao[];

    @OneToMany(() => Cartao, cartao => cartao.conta)
    cartoes: Cartao[];

    @Column({ default: true })
    ativo: boolean;

    @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date | null;
}