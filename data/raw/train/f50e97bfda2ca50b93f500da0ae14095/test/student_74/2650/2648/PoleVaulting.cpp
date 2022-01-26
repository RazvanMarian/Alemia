#include "PoleVaulting.h"
#include "EntityResolver.h"

PoleVaulting::PoleVaulting(SHORT x, SHORT y):Zombie(x, y)
{
	set_speed(4);
	set_damage(20);
	set_hp(70);
	set_base_speed(4);
	set();
}

void PoleVaulting::interaction()
{
	EntityResolver entity = EntityResolver::getInstance();
	for (auto i = 0; i < entity.plants_list()->size(); i++) {
		if (get_poz().X <= entity.plants_list()->at(i)->get_poz().X + 6
			&& get_poz().X >= entity.plants_list()->at(i)->get_poz().X
			&& get_poz().Y == entity.plants_list()->at(i)->get_poz().Y) 
		{
			if (jumped==true) {
				entity.plants_list()->at(i)->set_hp(entity.plants_list()->at(i)->get_hp() - get_damage());
				set_speed(0);
				if (entity.plants_list()->at(i)->died())
				{
					set_speed(get_base_speed());
				}
			}
			else {
				jumped = true;
				empty_box();
				draw();
				clear();
				set_poz({ get_poz().X - 11, get_poz().Y });
				set_speed(get_base_speed());
				set();
				draw();
			}
		}
	}
}

void PoleVaulting::set()
{
	if (box_content()->size() == 0) {
		box_content()->push_back({ "" , 8 });
		box_content()->push_back({ " ____ " , 2 });
		box_content()->push_back({ "(o_p )" , 2 });
		std::string line{ (char)218 }; line += (char)196; line += " "; line += (char)218; line += (char)196; line += "]";
		box_content()->push_back({ line, 2 });
		line = "  "; line += (char)245; line += " "; line += (char)245;
		box_content()->push_back({ line, 13 });
	}
}
