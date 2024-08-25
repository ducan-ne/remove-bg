import { link, table } from "@nextui-org/theme"
import {
  Button,
  Cell,
  Column,
  DropZone,
  FileTrigger,
  Row,
  Table,
  TableBody,
  TableHeader,
  type FileDropItem,
} from "react-aria-components"
import { Toaster } from "sonner"
import { Spinner } from "@nextui-org/react"
import { proxy, useSnapshot } from "valtio"
import { AnimatePresence, motion } from "framer-motion"
import MotionNumber from "motion-number"
import PQueue from "p-queue"
import { removeBg } from "./ai"

// classes
const tableCls = table()
const linkCls = link()

type Image = {
  status: "done" | "loading" | "error"
  previewUrl: string
  downloadUrl: string
  originalSize: number
  convertedSize: number
  filename: string
  duration: number
  progress: number
}

const state = proxy<{
  convertedImages: Array<Image>
}>({
  convertedImages: [],
})


// not sure why but it makes browser crash if
const queue = new PQueue({concurrency: 1});

const Converter = () => {
  const { convertedImages } = useSnapshot(state)

  const onFiles = (files: File[]) => {
    for (const file of files) {
      if (file.type.indexOf("image") === -1) {
        continue
      }
      queue.add(async function () {
        const index = state.convertedImages.push({
          status: "loading",
          originalSize: file.size,
          previewUrl: URL.createObjectURL(file),
          convertedSize: 0,
          duration: 0,
          downloadUrl: "",
          filename: file.name,
          progress: 0,
        })
        const start = Date.now()
        const row = state.convertedImages[index - 1]
        const timer = setInterval(() => {
          if (row.status !== "loading") {
            clearInterval(timer)
            return
          }
          row.duration = Date.now() - start
        }, 300)
        try {
          const imageUrl = URL.createObjectURL(await removeBg(row.previewUrl))

          // state.convertedImages[index - 1].previewUrl = previewUrl
          row.previewUrl = imageUrl
          row.downloadUrl = imageUrl
          row.status = "done"
          row.duration = Date.now() - start
        } catch (e) {
          console.log("Error:", e)
          row.status = "error"
        } finally {
          // destroy()
        }
      })
    }
  }

  return (
    <section id="image-converter" style={{ width: "100%", height: "100%" }}>
      <div className="flex gap-4 flex-col items-center light">
        <Toaster position="top-center" />
        <DropZone
          className={`w-full flex flex-col items-center justify-center drop-target:scale-125 transition-all`}
          onDrop={async (e) => {
            const files = e.items.filter((file) => file.kind === "file") as FileDropItem[]
            onFiles(await Promise.all(files.map((file) => file.getFile())))
          }}
        >
          <FileTrigger
            allowsMultiple
            onSelect={async (e) => {
              if (!e) {
                return
              }
              let files = Array.from(e)
              if (files.length === 0) {
                return
              }
              onFiles(files)
            }}
            acceptedFileTypes={["image/*"]}
          >
            <Button className="appearance-none inline-flex hover:shadow-2xl transition-all duration-300 hover:scale-110 dragging:bg-gray-500 items-center group space-x-2.5 bg-black text-white py-10 px-12 rounded-2xl cursor-pointer w-fit text-xl">
              Choose file or drag here
            </Button>
          </FileTrigger>
        </DropZone>
        <p className="text-sm text-gray-500 mt-4">
          Or upload a dictory
        </p>
        <DropZone
          className={`w-full flex flex-col items-center justify-center drop-target:scale-125 transition-all`}
          onDrop={async (e) => {
            const files = e.items.filter((file) => file.kind === "file") as FileDropItem[]
            onFiles(await Promise.all(files.map((file) => file.getFile())))
          }}
        >
          <FileTrigger
            allowsMultiple
            acceptDirectory
            onSelect={async (e) => {
              if (!e) {
                return
              }
              let files = Array.from(e)
              if (files.length === 0) {
                return
              }
              onFiles(files)
            }}
            acceptedFileTypes={["image/*"]}
          >
            <Button className="appearance-none inline-flex hover:shadow-2xl transition-all duration-300 hover:scale-110 dragging:bg-gray-500 items-center group space-x-2.5 bg-black text-white py-10 px-12 rounded-2xl cursor-pointer w-fit text-xl">
              Choose directory or drag here
            </Button>
          </FileTrigger>
        </DropZone>
        <p className="text-sm text-gray-500 mt-4">
          Images are not uploaded to the server, they are converted directly in your browser.
        </p>
        <Table aria-label="Converted images" className={tableCls.table()}>
          <TableHeader className={tableCls.thead()}>
            <Column isRowHeader className={`${tableCls.th()} w-12 text-slate-800`}>
              No
            </Column>
            <Column className={`${tableCls.th()} w-32 text-slate-800`}>Status</Column>
            {/* <Column className={`${tableCls.th()} w-32`}>Name</Column> */}
            <Column className={`${tableCls.th()} w-40 text-slate-800`}>Image</Column>
            <Column className={`${tableCls.th()} w-32 text-slate-800`}>Duration</Column>
            <Column className={`${tableCls.th()} text-slate-800`}>Actions</Column>
          </TableHeader>
          <TableBody className={tableCls.tbody()}>
            {convertedImages.map((image, index) => (
              <Row className={tableCls.tr()} key={index}>
                <Cell className={tableCls.td()}>{index + 1}</Cell>
                <Cell className={tableCls.td()}>
                  <AnimatePresence>
                    <motion.div
                      key={String(image.status)}
                      initial={{ y: 0 }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      {image.status === "loading" && <Spinner label={`${image.progress}%`} />}
                      {image.status === "done" && "Done"}
                      {image.status === "error" && <span className="text-red-500">Error</span>}
                    </motion.div>
                  </AnimatePresence>
                </Cell>
                {/* <Cell className={tableCls.td()}>{image.filename}</Cell> */}
                <Cell className={tableCls.td()}>
                  <div
                    style={{
                      background:
                        'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURb+/v////5nD/3QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVBjTYwABQSCglEENMxgYGAAynwRB8BEAgQAAAABJRU5ErkJggg==")',
                    }}
                    className="w-fit h-20"
                  >
                    <img
                      src={image.previewUrl}
                      alt="converted"
                      className="h-20 object-scale-down rounded-lg"
                    />
                  </div>
                </Cell>
                <Cell className={`${tableCls.td()}`}>
                  <MotionNumber
                    value={image.duration / 1000}
                    format={{ style: "decimal", maximumFractionDigits: 2 }} // Intl.NumberFormat() options
                    locales="en-US" // Intl.NumberFormat() locales
                  />
                  s
                </Cell>
                <Cell className={tableCls.td()}>
                  <Button
                    className={link}
                    isDisabled={image.status !== "done"}
                    onPress={() => {
                      const a = document.createElement("a")
                      a.href = image.downloadUrl
                      a.download = "image"
                      a.click()
                    }}
                  >
                    Download
                  </Button>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

export default Converter
