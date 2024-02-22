import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Topic } from "./topic.entity";
import { Answer } from "./answer.entity";

@Entity("questions")
export class Question {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title:string
    
    @Column({nullable:false})
    description: string

    @Column()
    image:string

    @ManyToMany((type)=>User, (user)=>user.upvotedQuestions)
    @JoinTable()
    upvotedBy: User[]

    @Column({nullable:true})
    downvote: boolean

    @ManyToOne(type=>User, (user)=>user.questions)
    belongsTo: User

    @ManyToMany((type)=>Topic, (topic)=>topic.questions)
    @JoinTable()
    assignedTopics:Topic[]

    @OneToMany((type)=>Answer, (answer)=>answer.question)
    answers: Answer[]
}