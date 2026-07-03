import { Modal } from "@heroui/react";
import { CircleUser } from "lucide-react";
import AnimatedList from "@/components/ui/AnimatedList";

type Props = {
  isOpen: boolean;
  members: any[];
  isLoading: boolean;
  onClose: () => void;
  onLoadMore: () => void;
};

export default function ProjectMembersModal({
  isOpen,
  members,
  isLoading,
  onClose,
  onLoadMore,
}: Props) {
  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop variant="blur" className="bg-[#09080f]/60">
        <Modal.Container className="max-w-2xl w-full ">
          <Modal.Dialog className="bg-[#110f1a] border border-[#2a2040] text-[#b8aed4] rounded-xl shadow-2xl shadow-black/40">
            {({ close }) => (
              <>
                <Modal.CloseTrigger className="text-[#b8aed4] bg-[#110f1a] hover:bg-[#2b1e51] hover:text-[#e8e4f0] active:bg-[#2a2040] rounded-lg transition-colors" />
                <Modal.Header className="border-b border-[#2a2040] pb-4">
                  <Modal.Heading className="text-[#e8e4f0] text-2xl font-semibold">
                    Project members
                  </Modal.Heading>
                </Modal.Header>

                <Modal.Body className=" py-4">
                  <div style={{ height: 320 }}>
                    <AnimatedList
                      onItemSelect={() => {}}
                      items={members}
                      onScrollEnd={onLoadMore}
                      isLoading={isLoading}
                      showGradients
                      enableArrowNavigation={false}
                      displayScrollbar
                      renderItem={(member: any) => (
                        <div className="w-full flex items-center gap-3 rounded-xl transition-colors">
                          <div className="w-12 h-12 rounded-full bg-[#1a152b] border border-[#3d2d6b] overflow-hidden flex items-center justify-center shrink-0">
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={member.name ?? "User"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <CircleUser
                                size={16}
                                className="text-[#c4a8f5]"
                              />
                            )}
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="text-md text-[#e8e4f0] font-semibold truncate">
                              {member.name ?? "Unnamed user"}
                            </span>
                            {member.role && (
                              <span className="text-sm text-[#7c6fa0] truncate">
                                {member.role}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </Modal.Body>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
