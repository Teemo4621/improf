import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

describe('ProfilesController', () => {
    let profileController: ProfilesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProfilesController],
            providers: [ProfilesService],
        }).compile();

        profileController = module.get<ProfilesController>(ProfilesController);
    });

    it('should be defined', () => {
        expect(profileController).toBeDefined();
    });
});
