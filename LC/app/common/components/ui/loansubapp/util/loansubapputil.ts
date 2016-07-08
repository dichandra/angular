export class LoanSubAppUtil
{
    public static loanEventManagerMap = new Map();
    public static getLoanEventMananger(loanId)
    {
        if(this.loanEventManagerMap[loanId])
        {
            return this.loanEventManagerMap[loanId];
        }
        else
        {
            
        }
    }
}

