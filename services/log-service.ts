import PrismaService from "./prisma-service";

class LogService {
  static instance: LogService;
  private prismaService: PrismaService = PrismaService.getInstance();
  
  static getInstance(): LogService {
    if(!LogService.instance) {
      LogService.instance = new LogService();
      console.log('New log service instance has been created.');
    }
    return LogService.instance;
  }

  public logEvent = async (type: string, userId: string, content: object) => {
    console.log(`Logging ${JSON.stringify(content)}`);
    console.log(`Log type ${type}`);
    console.log(`Log operator ${userId}`);
    await this.prismaService.prisma.log.create({
      data: {
        type: type,
        content: content,
        userId: userId,
      }
    });
  }
}

export default LogService;