import { sendMail } from "@/lib/mail";
import { ClientResponse } from "@sendgrid/mail";

type EmailTemplateDataType = {
    userName: string | null
    dueDate: string
    todoList: {
        name: string
        url: string
    }[] | null
}

export const RemainderEmail = (tomorrow: Date) => {

    const userData = new Map<string, EmailTemplateDataType>()

    const emailTemplateData: EmailTemplateDataType = {
        "userName": null,
        "dueDate": tomorrow.toDateString(),
        "todoList": null
    }

    const failedMail: string[] = [];

    const resetData = () => {
        userData.clear();
        failedMail.length = 0;
    }

    const processEmail = (data: any[]) => {
        resetData();

        for(let i = 0; i < data.length; i++){
    
            const row = data[i];

            if(!userData.has(row.email)){
                const currEmailTemplateData = {...emailTemplateData};

                currEmailTemplateData.userName = currEmailTemplateData.userName ?? row.email.split("@")[0];
                currEmailTemplateData.todoList = []

                userData.set(row.email, currEmailTemplateData);
            }
    
            const { todoList } = userData.get(row.email) as EmailTemplateDataType;
            
            todoList?.push({
                name: row.title,
                url: `${process.env.BASE_URL}${row.folder_id ? `/folder/${row.folder_id}` : ''}?todo_id=${row.todo_id}`
            });
        }
        console.log(userData)
    }

    const handleMailStatus = async (mailRes: ClientResponse, mail: string, count: number) => {
        console.log("mail status", mailRes);

        if(mailRes.statusCode !== 202) failedMail.push(mail);

        count === userData.size && failedMail.length !== 0 && retryMailSend();
    }

    const retryMailSend = () => {
        for (const email of failedMail) {
            sendMail(email, "TODO Remainder -", userData.get(email) as EmailTemplateDataType);
        }
    }

    const sendUserEmail = async () => {
        let count = 1;
        for (const [email, data] of userData) {
            const res = await sendMail(email, "TODO Remainder -", data);
            handleMailStatus(res, email, count++)
        }
    }

    return { processEmail, sendUserEmail }
}
